import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';
import { authenticateUser } from '../_apiUtils.js';
import * as Sentry from '@sentry/node';

// Import schema
import { onboardingResponses } from '../../drizzle/schema.js';

export default async function handler(req, res) {
  console.log(`API: ${req.method} /api/onboarding/status`);
  
  try {
    // Authenticate user
    const user = await authenticateUser(req);
    console.log(`Authenticated user: ${user.id}`);
    
    // Only allow GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Connect to database
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);
    
    // Fetch onboarding status
    const responses = await db.select()
      .from(onboardingResponses)
      .where(eq(onboardingResponses.userId, user.id));
    
    if (responses.length === 0) {
      // User hasn't started onboarding
      console.log(`User ${user.id} has not completed onboarding`);
      return res.status(200).json({ completed: false, responses: {} });
    }
    
    // User has onboarding data
    const onboarding = responses[0];
    console.log(`User ${user.id} onboarding status: ${onboarding.completed ? 'completed' : 'in progress'}`);
    
    return res.status(200).json({
      completed: onboarding.completed,
      responses: onboarding.responses
    });
  } catch (error) {
    console.error('Error in onboarding status API:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}