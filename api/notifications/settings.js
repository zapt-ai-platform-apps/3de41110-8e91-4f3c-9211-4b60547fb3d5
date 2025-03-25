import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';
import { authenticateUser } from '../_apiUtils.js';
import * as Sentry from '@sentry/node';

// Import schema
import { userPreferences } from '../../drizzle/schema.js';

export default async function handler(req, res) {
  console.log(`API: ${req.method} /api/notifications/settings`);
  
  try {
    // Authenticate user
    const user = await authenticateUser(req);
    console.log(`Authenticated user: ${user.id}`);
    
    // Connect to database
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);
    
    // Handle GET request - fetch notification settings
    if (req.method === 'GET') {
      const preferences = await db.select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, user.id));
      
      if (preferences.length === 0) {
        return res.status(200).json({ notificationTime: null });
      }
      
      console.log(`Retrieved notification settings for user ${user.id}`);
      return res.status(200).json({ notificationTime: preferences[0].notificationTime });
    }
    
    // Handle POST request - update notification settings
    if (req.method === 'POST') {
      const { notificationTime } = req.body;
      
      if (notificationTime === undefined) {
        return res.status(400).json({ error: 'Notification time is required' });
      }
      
      console.log(`Saving notification time ${notificationTime} for user ${user.id}`);
      
      // Check if user preferences already exist
      const existingPrefs = await db.select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, user.id));
      
      let preferences;
      
      if (existingPrefs.length > 0) {
        // Update existing preferences
        const [updated] = await db.update(userPreferences)
          .set({
            notificationTime,
            updatedAt: new Date()
          })
          .where(eq(userPreferences.userId, user.id))
          .returning();
        
        preferences = updated;
        console.log(`Updated notification settings for user ${user.id}`);
      } else {
        // Create new preferences
        const [created] = await db.insert(userPreferences)
          .values({
            userId: user.id,
            notificationTime
          })
          .returning();
        
        preferences = created;
        console.log(`Created new notification settings for user ${user.id}`);
      }
      
      return res.status(200).json({ notificationTime: preferences.notificationTime });
    }
    
    // Handle unsupported methods
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in notification settings API:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}