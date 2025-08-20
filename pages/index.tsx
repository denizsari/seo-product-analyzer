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

export default function Home() {
  const [product, setProduct] = useState('');
  const [result, setResult] = useState<SEOResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [testMode, setTestMode] = useState(false);

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
      
      const endpoint = testMode ? '/api/test-seo' : '/api/seo';
      
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              SEO Product Analyzer
            </h1>
            <p className="text-gray-600">
              Generate SEO-optimized content for your products using AI-powered analysis
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
      </div>
    </div>
  );
}