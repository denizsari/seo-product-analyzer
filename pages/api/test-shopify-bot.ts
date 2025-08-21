import { NextApiRequest, NextApiResponse } from 'next';
import { handleCors } from '../../utils/cors';

interface TestResult {
  success: boolean;
  endpoint: string;
  test_case: string;
  response?: any;
  error?: string;
  timestamp: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle CORS
  if (handleCors(req, res)) {
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { test_type = 'basic' } = req.body;
    
    console.log('=== SHOPIFY SEO BOT TEST ===');
    console.log('Test Type:', test_type);

    const testCases = [
      {
        name: 'basic_dropshipping',
        data: {
          product_name: 'Wireless Bluetooth Headphones',
          shopify_store_type: 'dropshipping',
          target_price_range: '25_50',
          additional_context: 'High-quality audio, noise cancellation'
        }
      },
      {
        name: 'handmade_premium',
        data: {
          product_name: 'Handcrafted Leather Wallet',
          shopify_store_type: 'handmade',
          target_price_range: '50_100',
          additional_context: 'Genuine leather, artisan crafted, personalized'
        }
      },
      {
        name: 'wholesale_bulk',
        data: {
          product_name: 'Organic Cotton T-Shirts',
          shopify_store_type: 'wholesale',
          target_price_range: 'under_25',
          additional_context: 'Bulk orders, eco-friendly, various sizes'
        }
      }
    ];

    const selectedCase = testCases.find(tc => tc.name === test_type) || testCases[0];
    
    console.log('Testing with case:', selectedCase.name);
    console.log('Test data:', selectedCase.data);

    // Determine base URL
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://seo-product-analyzer.vercel.app' 
      : 'http://localhost:3003';

    // Test the main API endpoint
    const testPayload = {
      ...selectedCase.data,
      requestId: `bot_test_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
    };

    console.log('Sending test request to:', `${baseUrl}/api/test-shopify-seo`);
    
    const startTime = Date.now();
    const response = await fetch(`${baseUrl}/api/test-shopify-seo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const responseData = await response.json();
    
    console.log('Test response status:', response.status);
    console.log('Test response time:', responseTime + 'ms');
    console.log('Test response data:', responseData);

    const result: TestResult = {
      success: response.ok && responseData.status === 'success',
      endpoint: '/api/test-shopify-seo',
      test_case: selectedCase.name,
      response: {
        status_code: response.status,
        response_time_ms: responseTime,
        data: responseData,
        validation: {
          has_seo_title: !!responseData.data?.seo_title,
          title_length_ok: (responseData.data?.seo_title?.length || 0) <= 70,
          has_meta_description: !!responseData.data?.meta_description,
          meta_length_ok: (responseData.data?.meta_description?.length || 0) <= 160,
          has_keywords: Array.isArray(responseData.data?.keywords) && responseData.data.keywords.length > 0,
          has_shopify_tags: Array.isArray(responseData.data?.shopify_tags) && responseData.data.shopify_tags.length > 0,
          has_product_description: !!responseData.data?.product_description
        }
      },
      timestamp: new Date().toISOString()
    };

    if (!response.ok) {
      result.error = `HTTP ${response.status}: ${response.statusText}`;
    }

    console.log('=== TEST RESULT ===');
    console.log('Success:', result.success);
    console.log('Validation:', result.response?.validation);

    return res.status(200).json({
      message: 'Shopify SEO Bot Test Complete',
      result: result,
      test_payload: testPayload,
      available_test_types: testCases.map(tc => tc.name)
    });

  } catch (error) {
    console.error('Bot test error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}