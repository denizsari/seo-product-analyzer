import { NextApiRequest, NextApiResponse } from 'next';
import { handleCors } from '../../utils/cors';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://dnzsrslk.app.n8n.cloud/webhook/cb04381c-f75c-403e-8dee-0ccc087fd732';

interface PendingRequest {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  timeout: NodeJS.Timeout;
}

// Store pending requests with unique IDs
const pendingRequests = new Map<string, PendingRequest>();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle CORS (includes preflight OPTIONS handling)
  if (handleCors(req, res)) {
    return; // Request was handled (OPTIONS preflight)
  }

  // Only allow POST requests for the main functionality
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, requestId } = req.body;
    console.log('=== SEO API REQUEST ===');
    console.log('Title:', title);
    console.log('RequestId:', requestId);

    if (!title) {
      return res.status(400).json({ error: 'Product title is required' });
    }

    if (!requestId) {
      return res.status(400).json({ error: 'Request ID is required' });
    }

    console.log('Setting up pending request for:', requestId);
    
    // Create promise to wait for webhook response
    const responsePromise = new Promise<any>((resolve, reject) => {
      // Set timeout for 60 seconds
      const timeout = setTimeout(() => {
        console.log('Request timeout for:', requestId);
        pendingRequests.delete(requestId);
        reject(new Error('Request timeout'));
      }, 60000);

      pendingRequests.set(requestId, { resolve, reject, timeout });
    });

    console.log('Triggering n8n webhook:', N8N_WEBHOOK_URL);
    
    // Trigger n8n workflow
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        title: title,
        requestId: requestId
      }),
    });

    console.log('n8n response status:', n8nResponse.status);
    const n8nResponseText = await n8nResponse.text();
    console.log('n8n response body:', n8nResponseText);

    if (!n8nResponse.ok) {
      pendingRequests.delete(requestId);
      throw new Error(`n8n webhook returned ${n8nResponse.status}: ${n8nResponseText}`);
    }

    console.log('Waiting for webhook response...');
    // Wait for the workflow to complete and send result back
    const finalResult = await responsePromise;
    console.log('Received final result:', JSON.stringify(finalResult, null, 2));
    return res.status(200).json(finalResult);

  } catch (error) {
    console.error('Error processing SEO request:', error);
    return res.status(500).json({ 
      error: 'Failed to process SEO request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Export the pending requests map for use in webhook handler
export { pendingRequests };