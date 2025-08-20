import { NextApiRequest, NextApiResponse } from 'next';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://your-n8n-domain.com/webhook/cb04381c-f75c-403e-8dee-0ccc087fd732';

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { product } = req.body;

    if (!product) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    // Generate unique request ID
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create promise to wait for webhook response
    const responsePromise = new Promise<any>((resolve, reject) => {
      // Set timeout for 60 seconds
      const timeout = setTimeout(() => {
        pendingRequests.delete(requestId);
        reject(new Error('Request timeout'));
      }, 60000);

      pendingRequests.set(requestId, { resolve, reject, timeout });
    });

    // Trigger n8n workflow
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        title: product,
        requestId: requestId // Pass the request ID to track the response
      }),
    });

    if (!n8nResponse.ok) {
      pendingRequests.delete(requestId);
      throw new Error(`n8n webhook returned ${n8nResponse.status}`);
    }

    // Wait for the workflow to complete and send result back
    const finalResult = await responsePromise;
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