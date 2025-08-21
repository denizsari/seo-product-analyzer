import { NextApiRequest, NextApiResponse } from 'next';
import { handleCors } from '../../utils/cors';
import { pendingRequests, ShopifySEOResponse } from './shopify-seo';

// Extended interface for n8n workflow response
interface N8nShopifyResponse extends ShopifySEOResponse {
  request_id?: string;
  input?: {
    requestId?: string;
    product_name?: string;
    shopify_store_type?: string;
    target_price_range?: string;
    additional_context?: string;
  };
  generated_at?: string;
}

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
    console.log('=== SHOPIFY SEO RESULTS WEBHOOK RECEIVED ===');
    console.log('Full request body:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', req.headers);
    
    // Try multiple ways to get the data
    let resultData: N8nShopifyResponse;
    
    // Check if n8n sent data directly (not wrapped)
    if (req.body.status || req.body.data || req.body.error) {
      resultData = req.body; // n8n sent data directly
      console.log('Using direct body as result data');
    } else if (req.body.data) {
      // Data is wrapped in { data: ... }
      resultData = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data;
      console.log('Using wrapped data from body.data');
    } else {
      console.log('No recognizable data structure found');
      return res.status(400).json({ 
        error: 'No valid data received', 
        receivedBody: req.body 
      });
    }

    console.log('Parsed result data:', JSON.stringify(resultData, null, 2));
    
    // Extract request ID from multiple possible locations
    const requestId = resultData.request_id || 
                     resultData.input?.requestId ||
                     req.body.requestId ||
                     req.headers['x-request-id'] as string;
    
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
      message: 'Shopify SEO result received successfully',
      status: 'success',
      processedRequestId: requestId
    });

  } catch (error) {
    console.error('Error processing Shopify SEO results:', error);
    return res.status(500).json({ 
      error: 'Failed to process Shopify SEO results',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}