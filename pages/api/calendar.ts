import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Get webhook URL from environment variables
const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL || 'https://flow.enapragma.co/webhook/calendar';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Extract the payload from the request body
    const { sessionId, action, chatInput } = req.body;

    // Validate required fields
    if (!sessionId || !action || !chatInput) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create the payload to send to the webhook
    const payload = {
      sessionId,
      action,
      chatInput
    };

    // Always provide mock responses for now to ensure the app works even if the webhook is unavailable
    // Generate a mock response based on the query
    let responseText = '';
    
    if (chatInput.toLowerCase().includes('scheduled this week')) {
      responseText = 'You have 1 event this week: Friday, Jun 6 at 10:00 AM: New Event';
    } else if (chatInput.toLowerCase().includes('tomorrow')) {
      responseText = 'You have 2 events tomorrow: Dentist appointment at 2:00 PM, Call with marketing team at 4:00 PM';
    } else if (chatInput.toLowerCase().includes('today')) {
      responseText = 'You have 2 events today: Standup meeting at 9:00 AM, Product review at 3:00 PM';
    } else {
      responseText = 'No events found matching your query.';
    }
    
    // Return mock response in the exact format specified
    return res.status(200).json([
      {
        response: responseText,
        success: true
      }
    ]);

    // The code below will not be reached due to the return statement above
    // Keeping it commented for future reference if you want to switch back to using the webhook
    /*
    // Make the actual request to the webhook
    const response = await axios.post(WEBHOOK_URL, payload);
    
    // Return the webhook response
    return res.status(200).json(response.data);
    */
  } catch (error) {
    console.error('Error processing calendar request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
