import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';
import { authenticateUser } from '../_apiUtils.js';
import * as Sentry from '@sentry/node';

// Import schema
import { onboardingResponses, userPreferences } from '../../drizzle/schema.js';

export default async function handler(req, res) {
  console.log(`API: ${req.method} /api/onboarding/complete`);
  
  try {
    // Authenticate user
    const user = await authenticateUser(req);
    console.log(`Authenticated user: ${user.id}`);
    
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { responses } = req.body;
    
    if (!responses) {
      return res.status(400).json({ error: 'Responses are required' });
    }
    
    // Connect to database
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);
    
    // Check if user already has onboarding data
    const existingResponses = await db.select()
      .from(onboardingResponses)
      .where(eq(onboardingResponses.userId, user.id));
    
    // Save onboarding responses
    if (existingResponses.length > 0) {
      // Update existing record
      await db.update(onboardingResponses)
        .set({
          responses,
          completed: true,
          updatedAt: new Date()
        })
        .where(eq(onboardingResponses.userId, user.id));
      
      console.log(`Updated onboarding responses for user ${user.id}`);
    } else {
      // Create new record
      await db.insert(onboardingResponses)
        .values({
          userId: user.id,
          responses,
          completed: true
        });
      
      console.log(`Created onboarding responses for user ${user.id}`);
    }
    
    // Also save notification time preference if provided
    if (responses.notificationTime) {
      const existingPrefs = await db.select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, user.id));
      
      if (existingPrefs.length > 0) {
        // Update existing preferences
        await db.update(userPreferences)
          .set({
            notificationTime: responses.notificationTime,
            updatedAt: new Date()
          })
          .where(eq(userPreferences.userId, user.id));
        
        console.log(`Updated notification time for user ${user.id}`);
      } else {
        // Create new preferences
        await db.insert(userPreferences)
          .values({
            userId: user.id,
            notificationTime: responses.notificationTime
          });
        
        console.log(`Created notification time for user ${user.id}`);
      }
    }
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in onboarding complete API:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}