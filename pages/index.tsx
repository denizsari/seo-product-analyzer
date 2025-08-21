import { useState } from 'react';

interface SEOMetaData {
  title: string;
  description: string;
  keywords: string;
}

interface ProductContent {
  product_title: string;
  product_description: string;
}

interface SEOResult {
  timestamp: string;
  status: string;
  data: {
    seo_meta: SEOMetaData;
    product_content: ProductContent;
  };
  original_request: {
    product: string;
  };
}

// Shopify SEO interfaces
interface ShopifyStoreType {
  value: 'dropshipping' | 'private_label' | 'wholesale' | 'handmade';
  label: string;
}

interface PriceRange {
  value: 'under_25' | '25_50' | '50_100' | '100_plus';
  label: string;
}

interface ShopifySEOResult {
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

const STORE_TYPES: ShopifyStoreType[] = [
  { value: 'dropshipping', label: 'Dropshipping' },
  { value: 'private_label', label: 'Private Label' },
  { value: 'wholesale', label: 'Wholesale' },
  { value: 'handmade', label: 'Handmade' }
];

const PRICE_RANGES: PriceRange[] = [
  { value: 'under_25', label: 'Under $25' },
  { value: '25_50', label: '$25 - $50' },
  { value: '50_100', label: '$50 - $100' },
  { value: '100_plus', label: '$100+' }
];

export default function Home() {
  // Regular SEO states
  const [product, setProduct] = useState('');
  const [result, setResult] = useState<SEOResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [testMode, setTestMode] = useState(false);

  // Shopify SEO states
  const [shopifyProductName, setShopifyProductName] = useState('');
  const [shopifyStoreType, setShopifyStoreType] = useState<ShopifyStoreType['value']>('dropshipping');
  const [shopifyPriceRange, setShopifyPriceRange] = useState<PriceRange['value']>('under_25');
  const [shopifyAdditionalContext, setShopifyAdditionalContext] = useState('');
  const [shopifyResult, setShopifyResult] = useState<ShopifySEOResult | null>(null);
  const [shopifyLoading, setShopifyLoading] = useState(false);
  const [shopifyError, setShopifyError] = useState('');
  const [shopifyTestMode, setShopifyTestMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default GET submission behavior
    e.preventDefault();
    
    if (!product.trim()) {
      setError('Please enter a product title');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Generate unique request ID for tracking
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Use production domain for API calls
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://seo-product-analyzer.vercel.app' 
        : '';
      const endpoint = testMode ? `${baseUrl}/api/test-seo` : `${baseUrl}/api/seo`;
      
      // Send POST request with proper JSON payload
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          title: product.trim(),
          requestId: requestId 
        }),
      });

      // Handle response errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Invalid response format' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Parse and validate response
      console.log('=== FRONTEND RESPONSE ===');
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      console.log('Parsed response data:', data);
      
      if (!data) {
        throw new Error('Empty response received');
      }
      
      // Validate that data has the expected structure
      if (!data.timestamp && !data.status && !data.data) {
        console.warn('Response data missing expected structure:', data);
        // Still try to set it in case it's a different but valid format
      }
      
      console.log('Setting result state with:', data);
      setResult(data);
      console.log('Result state updated successfully');
    } catch (err) {
      console.error('Frontend form submission error:', err);
      console.error('Error stack:', (err as Error)?.stack);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleShopifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shopifyProductName.trim()) {
      setShopifyError('Please enter a product name');
      return;
    }

    setShopifyLoading(true);
    setShopifyError('');
    setShopifyResult(null);

    try {
      const requestId = `shopify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://seo-product-analyzer.vercel.app' 
        : '';
      const endpoint = shopifyTestMode ? `${baseUrl}/api/test-shopify-seo` : `${baseUrl}/api/shopify-seo`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          product_name: shopifyProductName.trim(),
          shopify_store_type: shopifyStoreType,
          target_price_range: shopifyPriceRange,
          additional_context: shopifyAdditionalContext.trim() || undefined,
          requestId: requestId 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Invalid response format' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Shopify SEO Response:', data);
      
      if (data.status === 'error') {
        throw new Error(data.error || 'Unknown error occurred');
      }
      
      setShopifyResult(data);
    } catch (err) {
      console.error('Shopify SEO error:', err);
      setShopifyError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setShopifyLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log(`${label} copied to clipboard`);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Character counters for Shopify SEO
  const shopifyTitleLength = shopifyResult?.data?.seo_title?.length || 0;
  const shopifyMetaLength = shopifyResult?.data?.meta_description?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SEO Product Analyzer
          </h1>
          <p className="text-xl text-gray-600">
            Generate SEO-optimized content for your products using AI-powered analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Regular SEO Analyzer */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🔍 General SEO Analysis
              </h2>
              <p className="text-gray-600">
                AI-powered SEO content generation
              </p>
            </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-2">
                Product Title
              </label>
              <input
                type="text"
                id="product"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                placeholder="Enter product title..."
                disabled={loading}
                required
              />
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={testMode}
                  onChange={(e) => setTestMode(e.target.checked)}
                  className="mr-2 rounded"
                  disabled={loading}
                />
                <span className="text-sm text-gray-600">Test mode (use mock data)</span>
              </label>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {testMode ? 'Generating Test Results...' : 'Processing with n8n...'}
                </>
              ) : (
                testMode ? 'Generate Test Results' : 'Analyze with n8n'
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="mt-8 space-y-6">
              {/* SEO Meta Data Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  SEO Meta Data
                </h2>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">Title</label>
                    <div className="bg-white p-3 rounded border text-gray-800">
                      {result.data.seo_meta.title}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">Description</label>
                    <div className="bg-white p-3 rounded border text-gray-800">
                      {result.data.seo_meta.description}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">Keywords</label>
                    <div className="bg-white p-3 rounded border text-gray-800">
                      {result.data.seo_meta.keywords}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Content Section */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-green-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Product Content
                </h2>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">Product Title</label>
                    <div className="bg-white p-3 rounded border text-gray-800 font-medium">
                      {result.data.product_content.product_title}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">Product Description</label>
                    <div className="bg-white p-4 rounded border text-gray-800 leading-relaxed">
                      {result.data.product_content.product_description}
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Analysis completed: {new Date(result.timestamp).toLocaleString()}</span>
                  <div className="flex items-center space-x-2">
                    {testMode && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        🧪 Test Mode
                      </span>
                    )}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ {result.status}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex justify-center space-x-4 pt-4">
                <button
                  onClick={() => setResult(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Clear Results
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Copy JSON
                </button>
              </div>
            </div>
          )}
          </div>

          {/* Shopify SEO Analyzer */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🛍️ Shopify SEO Generator
              </h2>
              <p className="text-gray-600">
                Specialized SEO content for Shopify stores
              </p>
            </div>
            
            <form onSubmit={handleShopifySubmit} className="space-y-6">
              {/* Product Name */}
              <div>
                <label htmlFor="shopify-product-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="shopify-product-name"
                  value={shopifyProductName}
                  onChange={(e) => setShopifyProductName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                  placeholder="Enter your product name..."
                  disabled={shopifyLoading}
                  required
                />
              </div>

              {/* Store Type and Price Range Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Store Type */}
                <div>
                  <label htmlFor="shopify-store-type" className="block text-sm font-medium text-gray-700 mb-2">
                    Store Type *
                  </label>
                  <select
                    id="shopify-store-type"
                    value={shopifyStoreType}
                    onChange={(e) => setShopifyStoreType(e.target.value as ShopifyStoreType['value'])}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                    disabled={shopifyLoading}
                    required
                  >
                    {STORE_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label htmlFor="shopify-price-range" className="block text-sm font-medium text-gray-700 mb-2">
                    Target Price Range *
                  </label>
                  <select
                    id="shopify-price-range"
                    value={shopifyPriceRange}
                    onChange={(e) => setShopifyPriceRange(e.target.value as PriceRange['value'])}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                    disabled={shopifyLoading}
                    required
                  >
                    {PRICE_RANGES.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Additional Context */}
              <div>
                <label htmlFor="shopify-additional-context" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Context (Optional)
                </label>
                <textarea
                  id="shopify-additional-context"
                  value={shopifyAdditionalContext}
                  onChange={(e) => setShopifyAdditionalContext(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors resize-none"
                  placeholder="Add any specific details about your product, target audience, or unique selling points..."
                  disabled={shopifyLoading}
                />
              </div>

              {/* Test Mode Toggle */}
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={shopifyTestMode}
                    onChange={(e) => setShopifyTestMode(e.target.checked)}
                    className="mr-2 rounded"
                    disabled={shopifyLoading}
                  />
                  <span className="text-sm text-gray-600">Test mode (use mock data)</span>
                </label>
              </div>
              
              <button
                type="submit"
                disabled={shopifyLoading}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
              >
                {shopifyLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {shopifyTestMode ? 'Generating Test Results...' : 'Generating Shopify SEO...'}
                  </>
                ) : (
                  'Generate Shopify SEO Content'
                )}
              </button>
            </form>

            {shopifyError && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-800 text-sm">{shopifyError}</p>
                </div>
              </div>
            )}

            {shopifyResult?.data && (
              <div className="mt-8 space-y-6">
                {/* SEO Title */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-blue-900 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      SEO Title
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm px-2 py-1 rounded ${
                        shopifyTitleLength <= 70 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {shopifyTitleLength}/70
                      </span>
                      <button
                        onClick={() => copyToClipboard(shopifyResult.data!.seo_title, 'SEO Title')}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border text-gray-800 text-sm">
                    {shopifyResult.data.seo_title}
                  </div>
                </div>

                {/* Meta Description */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-green-900 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Meta Description
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm px-2 py-1 rounded ${
                        shopifyMetaLength >= 120 && shopifyMetaLength <= 160 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {shopifyMetaLength}/160
                      </span>
                      <button
                        onClick={() => copyToClipboard(shopifyResult.data!.meta_description, 'Meta Description')}
                        className="p-1 text-green-600 hover:text-green-800 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border text-gray-800 text-sm">
                    {shopifyResult.data.meta_description}
                  </div>
                </div>

                {/* Keywords and Tags Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Keywords */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-md font-bold text-yellow-900 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        Keywords
                      </h3>
                      <button
                        onClick={() => copyToClipboard(shopifyResult.data!.keywords.join(', '), 'Keywords')}
                        className="p-1 text-yellow-600 hover:text-yellow-800 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <div className="flex flex-wrap gap-1">
                        {shopifyResult.data.keywords.map((keyword, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Shopify Tags */}
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-md font-bold text-indigo-900 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Shopify Tags
                      </h3>
                      <button
                        onClick={() => copyToClipboard(shopifyResult.data!.shopify_tags.join(', '), 'Shopify Tags')}
                        className="p-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <div className="flex flex-wrap gap-1">
                        {shopifyResult.data.shopify_tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex justify-center space-x-4 pt-4">
                  <button
                    onClick={() => setShopifyResult(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Clear Results
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(JSON.stringify(shopifyResult, null, 2))}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Copy JSON
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}