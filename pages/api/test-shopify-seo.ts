import { NextApiRequest, NextApiResponse } from 'next';
import { handleCors } from '../../utils/cors';

// Define ShopifySEOResponse interface locally
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
    requestId?: string;
  };
}

// Mock data that matches the expected Shopify SEO output format
const generateMockShopifyData = (productName: string, storeType: string, priceRange: string): ShopifySEOResponse => {
  const seoTitle = `${productName} - Premium Quality ${storeType === 'handmade' ? 'Handcrafted' : 'Professional'} Product`;
  const metaDescription = `Discover our top-rated ${productName.toLowerCase()} perfect for your ${storeType} business. Premium quality, competitive pricing, and fast shipping. Order now!`;
  
  return {
    status: 'success',
    data: {
      seo_title: seoTitle,
      meta_description: metaDescription,
      product_description: `Transform your business with our premium ${productName.toLowerCase()}. Specifically designed for ${storeType} businesses, this high-quality product delivers exceptional value in the ${priceRange.replace('_', ' $')} range.

Key Features:
• Premium materials and construction
• Perfect for ${storeType} business model
• Competitive pricing in ${priceRange.replace('_', ' $')} range
• Fast and reliable shipping
• Customer satisfaction guarantee

Whether you're building your ${storeType} empire or expanding your existing product line, our ${productName.toLowerCase()} provides the quality and reliability your customers expect. The thoughtful design and attention to detail make this an ideal choice for businesses focused on customer satisfaction.

Order today and experience the difference that quality makes in your ${storeType} business. With our competitive pricing and exceptional customer service, you'll have everything you need to succeed in today's competitive marketplace.`,
      keywords: [
        productName.toLowerCase(),
        `${storeType} business`,
        'premium quality',
        'fast shipping',
        'customer satisfaction',
        priceRange.replace('_', ' dollar'),
        'high quality product',
        'business growth'
      ],
      shopify_tags: [
        productName.toLowerCase().replace(/\s+/g, '-'),
        storeType,
        priceRange.replace('_', '-'),
        'premium',
        'bestseller',
        'trending',
        'new-arrival',
        'business-essential'
      ],
      character_counts: {
        title_length: seoTitle.length,
        meta_description_length: metaDescription.length
      }
    },
    timestamp: new Date().toISOString(),
    original_request: {
      product_name: productName,
      shopify_store_type: storeType,
      target_price_range: priceRange,
      requestId: `mock_${Date.now()}`
    }
  };
};

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
    } = req.body;

    console.log('=== TEST SHOPIFY SEO REQUEST ===');
    console.log('Product Name:', product_name);
    console.log('Store Type:', shopify_store_type);
    console.log('Price Range:', target_price_range);
    console.log('Additional Context:', additional_context);
    console.log('RequestId:', requestId);

    if (!product_name?.trim()) {
      return res.status(400).json({ 
        status: 'error',
        error: 'Product name is required' 
      });
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock data based on input
    const mockData = generateMockShopifyData(
      product_name.trim(), 
      shopify_store_type || 'dropshipping', 
      target_price_range || 'under_25'
    );

    console.log('Generated mock Shopify SEO data:', mockData);

    return res.status(200).json(mockData);

  } catch (error) {
    console.error('Error in test Shopify SEO endpoint:', error);
    return res.status(500).json({ 
      status: 'error',
      error: 'Failed to process test Shopify SEO request'
    });
  }
}