import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, and } from 'drizzle-orm';
import { authenticateUser } from '../_apiUtils.js';
import * as Sentry from '@sentry/node';

// Import schema
import { journalEntries } from '../../drizzle/schema.js';

export default async function handler(req, res) {
  console.log(`API: ${req.method} /api/journal/entries`);
  
  try {
    // Authenticate user
    const user = await authenticateUser(req);
    console.log(`Authenticated user: ${user.id}`);
    
    // Connect to database
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);
    
    // Handle GET request - fetch journal entries
    if (req.method === 'GET') {
      const entries = await db.select()
        .from(journalEntries)
        .where(eq(journalEntries.userId, user.id));
      
      console.log(`Retrieved ${entries.length} journal entries for user ${user.id}`);
      return res.status(200).json(entries);
    }
    
    // Handle POST request - create or update journal entry
    if (req.method === 'POST') {
      const { date, reflections, intentions } = req.body;
      
      if (!date) {
        return res.status(400).json({ error: 'Date is required' });
      }
      
      console.log(`Saving journal entry for user ${user.id} on date ${date}`);
      
      // Check if entry already exists for this date
      const existingEntries = await db.select()
        .from(journalEntries)
        .where(
          and(
            eq(journalEntries.userId, user.id),
            eq(journalEntries.date, date)
          )
        );
      
      let entry;
      
      if (existingEntries.length > 0) {
        // Update existing entry
        const [updated] = await db.update(journalEntries)
          .set({
            reflections,
            intentions,
            updatedAt: new Date()
          })
          .where(
            and(
              eq(journalEntries.userId, user.id),
              eq(journalEntries.date, date)
            )
          )
          .returning();
        
        entry = updated;
        console.log(`Updated journal entry for user ${user.id} on date ${date}`);
      } else {
        // Create new entry
        const [created] = await db.insert(journalEntries)
          .values({
            userId: user.id,
            date,
            reflections,
            intentions
          })
          .returning();
        
        entry = created;
        console.log(`Created new journal entry for user ${user.id} on date ${date}`);
      }
      
      return res.status(200).json(entry);
    }
    
    // Handle unsupported methods
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in journal entries API:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}