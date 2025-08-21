import { useState } from 'react';

// TypeScript interfaces
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

export default function ShopifySEO() {
  const [productName, setProductName] = useState('');
  const [storeType, setStoreType] = useState<ShopifyStoreType['value']>('dropshipping');
  const [priceRange, setPriceRange] = useState<PriceRange['value']>('under_25');
  const [additionalContext, setAdditionalContext] = useState('');
  const [result, setResult] = useState<ShopifySEOResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [testMode, setTestMode] = useState(false);
  const [botTesting, setBotTesting] = useState(false);
  const [botResult, setBotResult] = useState<any>(null);

  // Character counters
  const titleLength = result?.data?.seo_title?.length || 0;
  const metaLength = result?.data?.meta_description?.length || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName.trim()) {
      setError('Please enter a product name');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const requestId = `shopify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://seo-product-analyzer.vercel.app' 
        : '';
      const endpoint = testMode ? `${baseUrl}/api/test-shopify-seo` : `${baseUrl}/api/shopify-seo`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          product_name: productName.trim(),
          shopify_store_type: storeType,
          target_price_range: priceRange,
          additional_context: additionalContext.trim() || undefined,
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
      
      setResult(data);
    } catch (err) {
      console.error('Shopify SEO error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      console.log(`${label} copied to clipboard`);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const copyAllResults = async () => {
    if (!result?.data) return;
    
    const formattedText = `
SEO Title: ${result.data.seo_title}

Meta Description: ${result.data.meta_description}

Product Description:
${result.data.product_description}

Keywords: ${result.data.keywords.join(', ')}

Shopify Tags: ${result.data.shopify_tags.join(', ')}
    `.trim();
    
    await copyToClipboard(formattedText, 'All results');
  };

  const runBotTest = async (testType: string = 'basic_dropshipping') => {
    setBotTesting(true);
    setBotResult(null);
    
    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://seo-product-analyzer.vercel.app' 
        : '';
      
      const response = await fetch(`${baseUrl}/api/test-shopify-bot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test_type: testType }),
      });

      const data = await response.json();
      setBotResult(data);
      console.log('Bot test result:', data);
    } catch (err) {
      console.error('Bot test error:', err);
      setBotResult({ 
        success: false, 
        error: err instanceof Error ? err.message : 'Bot test failed' 
      });
    } finally {
      setBotTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Shopify SEO Generator
            </h1>
            <p className="text-gray-600">
              Generate optimized SEO content specifically for Shopify stores
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                id="product-name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                placeholder="Enter your product name..."
                disabled={loading}
                required
              />
            </div>

            {/* Store Type and Price Range Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Store Type */}
              <div>
                <label htmlFor="store-type" className="block text-sm font-medium text-gray-700 mb-2">
                  Store Type *
                </label>
                <select
                  id="store-type"
                  value={storeType}
                  onChange={(e) => setStoreType(e.target.value as ShopifyStoreType['value'])}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                  disabled={loading}
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
                <label htmlFor="price-range" className="block text-sm font-medium text-gray-700 mb-2">
                  Target Price Range *
                </label>
                <select
                  id="price-range"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value as PriceRange['value'])}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                  disabled={loading}
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
              <label htmlFor="additional-context" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Context (Optional)
              </label>
              <textarea
                id="additional-context"
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors resize-none"
                placeholder="Add any specific details about your product, target audience, or unique selling points..."
                disabled={loading}
              />
            </div>

            {/* Test Mode Toggle and Bot Test */}
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
              
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => runBotTest('basic_dropshipping')}
                  disabled={botTesting || loading}
                  className="px-3 py-1 text-xs font-medium text-purple-600 bg-purple-100 rounded hover:bg-purple-200 disabled:opacity-50"
                >
                  {botTesting ? 'Testing...' : '🤖 Bot Test'}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {testMode ? 'Generating Test Results...' : 'Generating Shopify SEO...'}
                </>
              ) : (
                'Generate Shopify SEO Content'
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

          {/* Bot Test Results */}
          {botResult && (
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">🤖 Bot Test Results</h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  botResult.result?.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {botResult.result?.success ? '✅ Pass' : '❌ Fail'}
                </span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Test Case: {botResult.result?.test_case}</div>
                <div>Response Time: {botResult.result?.response?.response_time_ms}ms</div>
                {botResult.result?.response?.validation && (
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    {Object.entries(botResult.result.response.validation).map(([key, value]) => (
                      <div key={key} className="flex items-center">
                        <span className={value ? 'text-green-600' : 'text-red-600'}>
                          {value ? '✓' : '✗'}
                        </span>
                        <span className="ml-1">{key.replace(/_/g, ' ')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {result?.data && (
            <div className="mt-8 space-y-6">
              {/* SEO Title */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold text-blue-900 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    SEO Title
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm px-2 py-1 rounded ${
                      titleLength <= 70 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {titleLength}/70
                    </span>
                    <button
                      onClick={() => copyToClipboard(result.data!.seo_title, 'SEO Title')}
                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="bg-white p-3 rounded border text-gray-800">
                  {result.data.seo_title}
                </div>
              </div>

              {/* Meta Description */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold text-green-900 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Meta Description
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm px-2 py-1 rounded ${
                      metaLength >= 120 && metaLength <= 160 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {metaLength}/160
                    </span>
                    <button
                      onClick={() => copyToClipboard(result.data!.meta_description, 'Meta Description')}
                      className="p-1 text-green-600 hover:text-green-800 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="bg-white p-3 rounded border text-gray-800">
                  {result.data.meta_description}
                </div>
              </div>

              {/* Product Description */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold text-purple-900 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Product Description
                  </h2>
                  <button
                    onClick={() => copyToClipboard(result.data!.product_description, 'Product Description')}
                    className="p-1 text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <div className="bg-white p-4 rounded border text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {result.data.product_description}
                </div>
              </div>

              {/* Keywords and Tags Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Keywords */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-yellow-900 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                      Keywords
                    </h2>
                    <button
                      onClick={() => copyToClipboard(result.data!.keywords.join(', '), 'Keywords')}
                      className="p-1 text-yellow-600 hover:text-yellow-800 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="flex flex-wrap gap-2">
                      {result.data.keywords.map((keyword, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-yellow-100 text-yellow-800">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Shopify Tags */}
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-indigo-900 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      Shopify Tags
                    </h2>
                    <button
                      onClick={() => copyToClipboard(result.data!.shopify_tags.join(', '), 'Shopify Tags')}
                      className="p-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="flex flex-wrap gap-2">
                      {result.data.shopify_tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Analysis completed: {result.timestamp ? new Date(result.timestamp).toLocaleString() : 'Now'}</span>
                  <div className="flex items-center space-x-2">
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
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Clear Results
                </button>
                <button
                  onClick={copyAllResults}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Copy All Content
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Copy JSON
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}