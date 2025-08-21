import { NextApiRequest, NextApiResponse } from 'next';
import { handleCors } from '../../utils/cors';

// Just forward to general SEO with formatted prompt
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle CORS
  if (handleCors(req, res)) {
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { product_name, shopify_store_type, target_price_range, additional_context, requestId } = req.body;

    if (!product_name?.trim()) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    if (!requestId) {
      return res.status(400).json({ error: 'Request ID is required' });
    }

    // Create Shopify-optimized prompt
    const shopifyPrompt = `Generate Shopify SEO content for:
Product: ${product_name.trim()}
Store Type: ${shopify_store_type || 'dropshipping'}
Price Range: $${target_price_range?.replace('_', '-') || '25-50'}
${additional_context ? `Context: ${additional_context.trim()}` : ''}

Create SEO-optimized content for Shopify store including title, description, keywords and tags.`;

    // Forward to general SEO endpoint
    const seoResponse = await fetch(`${req.headers.origin || 'https://seo-product-analyzer.vercel.app'}/api/seo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: shopifyPrompt,
        requestId: requestId
      })
    });

    const result = await seoResponse.json();
    return res.status(seoResponse.status).json(result);

  } catch (error) {
    console.error('Shopify SEO forwarding error:', error);
    return res.status(500).json({ 
      error: 'Failed to process request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}