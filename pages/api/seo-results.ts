import { NextApiRequest, NextApiResponse } from 'next';
import { pendingRequests } from './seo';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'No data received' });
    }

    // Parse the data if it's a string
    const resultData = typeof data === 'string' ? JSON.parse(data) : data;
    
    // Extract request ID from original request data or use a fallback method
    const requestId = resultData.original_request?.requestId || 
                     resultData.requestId ||
                     req.headers['x-request-id'];
    
    if (requestId && pendingRequests.has(requestId)) {
      // Resolve the pending request with the result
      const pendingRequest = pendingRequests.get(requestId);
      if (pendingRequest) {
        clearTimeout(pendingRequest.timeout);
        pendingRequest.resolve(resultData);
        pendingRequests.delete(requestId);
      }
    }

    // Return success to n8n
    return res.status(200).json({ 
      message: 'Result received successfully',
      status: 'success' 
    });

  } catch (error) {
    console.error('Error processing SEO results:', error);
    return res.status(500).json({ 
      error: 'Failed to process SEO results',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}