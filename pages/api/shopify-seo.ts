import { NextApiRequest, NextApiResponse } from 'next';
import { handleCors } from '../../utils/cors';

// TypeScript interfaces for Shopify SEO
interface ShopifyStoreType {
  value: 'dropshipping' | 'private_label' | 'wholesale' | 'handmade';
  label: string;
}

interface PriceRange {
  value: 'under_25' | '25_50' | '50_100' | '100_plus';
  label: string;
}

interface ShopifySEORequest {
  product_name: string;
  shopify_store_type: ShopifyStoreType['value'];
  target_price_range: PriceRange['value'];
  additional_context?: string;
  requestId: string;
}

interface ShopifySEOResponse {
  status: 'success' | 'error';
  data?: {
    seo_title: string;
    meta_description: string;
    product_description: string;
    keywords: string[];
    shopify_tags: string[];
    character_counts: {
      title_length: number;
      meta_description_length: number;
    };
  };
  error?: string;
  timestamp?: string;
  original_request?: {
    product_name: string;
    shopify_store_type: string;
    target_price_range: string;
    additional_context?: string;
    requestId?: string;
  };
}

const N8N_SHOPIFY_WEBHOOK_URL = process.env.N8N_SHOPIFY_WEBHOOK_URL || 'https://dnzsrslk.app.n8n.cloud/webhook/shopify-seo';

interface PendingRequest {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  timeout: NodeJS.Timeout;
}

// Store pending requests with unique IDs
const pendingRequests = new Map<string, PendingRequest>();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ShopifySEOResponse>
) {
  // Handle CORS (includes preflight OPTIONS handling)
  if (handleCors(req, res)) {
    return; // Request was handled (OPTIONS preflight)
  }

  // Only allow POST requests for the main functionality
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      status: 'error',
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    const { 
      product_name, 
      shopify_store_type, 
      target_price_range, 
      additional_context,
      requestId 
    }: ShopifySEORequest = req.body;

    console.log('=== SHOPIFY SEO API REQUEST ===');
    console.log('Product Name:', product_name);
    console.log('Store Type:', shopify_store_type);
    console.log('Price Range:', target_price_range);
    console.log('Additional Context:', additional_context);
    console.log('RequestId:', requestId);

    // Validation
    if (!product_name?.trim()) {
      return res.status(400).json({ 
        status: 'error',
        error: 'Product name is required' 
      });
    }

    if (!shopify_store_type) {
      return res.status(400).json({ 
        status: 'error',
        error: 'Shopify store type is required' 
      });
    }

    if (!target_price_range) {
      return res.status(400).json({ 
        status: 'error',
        error: 'Target price range is required' 
      });
    }

    if (!requestId) {
      return res.status(400).json({ 
        status: 'error',
        error: 'Request ID is required' 
      });
    }

    // Validate enum values
    const validStoreTypes = ['dropshipping', 'private_label', 'wholesale', 'handmade'];
    const validPriceRanges = ['under_25', '25_50', '50_100', '100_plus'];

    if (!validStoreTypes.includes(shopify_store_type)) {
      return res.status(400).json({ 
        status: 'error',
        error: 'Invalid store type. Must be one of: ' + validStoreTypes.join(', ') 
      });
    }

    if (!validPriceRanges.includes(target_price_range)) {
      return res.status(400).json({ 
        status: 'error',
        error: 'Invalid price range. Must be one of: ' + validPriceRanges.join(', ') 
      });
    }

    console.log('Setting up pending request for:', requestId);
    
    // Create promise to wait for webhook response
    const responsePromise = new Promise<any>((resolve, reject) => {
      // Set timeout for 60 seconds
      const timeout = setTimeout(() => {
        console.log('Request timeout for:', requestId);
        pendingRequests.delete(requestId);
        reject(new Error('Request timeout - n8n workflow took too long to respond'));
      }, 60000);

      pendingRequests.set(requestId, { resolve, reject, timeout });
    });

    console.log('Triggering n8n Shopify SEO webhook:', N8N_SHOPIFY_WEBHOOK_URL);
    
    // Trigger n8n workflow
    const n8nResponse = await fetch(N8N_SHOPIFY_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        product_name: product_name.trim(),
        shopify_store_type,
        target_price_range,
        additional_context: additional_context?.trim() || '',
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
    console.error('Error processing Shopify SEO request:', error);
    return res.status(500).json({ 
      status: 'error',
      error: 'Failed to process Shopify SEO request',
      timestamp: new Date().toISOString()
    });
  }
}

// Export the pending requests map for use in webhook handler
export { pendingRequests };
export type { ShopifySEORequest, ShopifySEOResponse };