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
    console.log('=== SEO RESULTS WEBHOOK RECEIVED ===');
    console.log('Full request body:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', req.headers);
    
    // Try multiple ways to get the data
    let resultData;
    
    // Check if n8n sent data directly (not wrapped in { data: ... })
    if (req.body.timestamp || req.body.status || req.body.data) {
      resultData = req.body; // n8n sent data directly
      console.log('Using direct body as result data');
    } else if (req.body.data) {
      // Data is wrapped in { data: ... }
      resultData = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data;
      console.log('Using wrapped data from body.data');
    } else {
      console.log('No recognizable data structure found');
      return res.status(400).json({ error: 'No valid data received', receivedBody: req.body });
    }

    console.log('Parsed result data:', JSON.stringify(resultData, null, 2));
    
    // Extract request ID from multiple possible locations
    const requestId = resultData.original_request?.requestId || 
                     resultData.requestId ||
                     req.headers['x-request-id'] ||
                     req.body.requestId;
    
    console.log('Extracted requestId:', requestId);
    console.log('Available pending requests:', Array.from(pendingRequests.keys()));
    
    if (requestId && pendingRequests.has(requestId)) {
      console.log('Found pending request, resolving...');
      // Resolve the pending request with the result
      const pendingRequest = pendingRequests.get(requestId);
      if (pendingRequest) {
        clearTimeout(pendingRequest.timeout);
        pendingRequest.resolve(resultData);
        pendingRequests.delete(requestId);
        console.log('Successfully resolved pending request');
      }
    } else {
      console.log('No matching pending request found for requestId:', requestId);
    }

    // Return success to n8n
    return res.status(200).json({ 
      message: 'Result received successfully',
      status: 'success',
      processedRequestId: requestId
    });

  } catch (error) {
    console.error('Error processing SEO results:', error);
    return res.status(500).json({ 
      error: 'Failed to process SEO results',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}