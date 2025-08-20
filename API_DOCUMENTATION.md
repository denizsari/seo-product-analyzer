# API Documentation - SEO Product Analyzer

## 🚀 **New Production URL**
**https://seo-product-analyzer-cdot896hv-dreamteamdevs-projects.vercel.app**

## 📋 **Form Submission Format**

### **Frontend Form Behavior**

The frontend form now properly:
- ✅ **Prevents default GET submission** with `e.preventDefault()`
- ✅ **Uses POST requests** with fetch API
- ✅ **Sends JSON payload** with proper headers
- ✅ **Includes error handling** and response validation
- ✅ **Generates unique request IDs** for tracking

### **Request Payload Structure**

```json
{
  "title": "Your Product Title Here",
  "requestId": "req_1692547890123_abc123def"
}
```

#### **Field Details:**
- **`title`** (string, required): The product title to analyze
- **`requestId`** (string, required): Unique identifier for request tracking

## 🔗 **API Endpoints**

### **1. Test Endpoint (Mock Data)**
```
POST /api/test-seo
```

**Purpose**: Returns immediate mock data for UI testing

**Request Headers:**
```json
{
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

**Request Body:**
```json
{
  "title": "Project Management Software",
  "requestId": "test-123-456"
}
```

**Response (200 OK):**
```json
{
  "timestamp": "2025-08-20T22:05:44.893Z",
  "status": "success",
  "data": {
    "seo_meta": {
      "title": "Advanced Project Management Software - Boost Team Productivity",
      "description": "Streamline your workflow with our comprehensive project management tool...",
      "keywords": "project management, task tracking, team collaboration..."
    },
    "product_content": {
      "product_title": "Advanced Project Management Software - Boost Team Productivity",
      "product_description": "Transform your team's productivity with our comprehensive..."
    }
  },
  "original_request": {
    "product": "Project Management Software",
    "requestId": "test-123-456"
  }
}
```

### **2. Live n8n Integration Endpoint**
```
POST /api/seo
```

**Purpose**: Triggers n8n workflow for real SEO analysis

**Request Headers:**
```json
{
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

**Request Body:**
```json
{
  "title": "Your Product Title",
  "requestId": "req_1692547890123_abc123def"
}
```

**Workflow:**
1. Validates input parameters
2. Triggers n8n webhook with payload
3. Waits for async response (60s timeout)
4. Returns processed SEO data

**Success Response (200 OK):**
```json
{
  "timestamp": "2025-08-20T22:00:00.000Z",
  "status": "success",
  "data": {
    "seo_meta": {
      "title": "SEO-optimized product title",
      "description": "Compelling meta description 120-160 chars",
      "keywords": "relevant, seo, keywords"
    },
    "product_content": {
      "product_title": "Same as SEO title",
      "product_description": "Detailed product description 150+ words"
    }
  },
  "original_request": {
    "product": "Your Product Title",
    "requestId": "req_1692547890123_abc123def"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Product title is required"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "Failed to process SEO request",
  "details": "n8n webhook returned 404"
}
```

### **3. Webhook Response Endpoint**
```
POST /api/seo-results
```

**Purpose**: Receives results from n8n workflow

**Used internally** by n8n to send processed results back to the application.

## 🧪 **Testing with cURL**

### **Test Mode (Immediate Response):**
```bash
curl -X POST https://seo-product-analyzer-cdot896hv-dreamteamdevs-projects.vercel.app/api/test-seo \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "title": "Project Management Software",
    "requestId": "test-123-456"
  }'
```

### **Live Mode (n8n Integration):**
```bash
curl -X POST https://seo-product-analyzer-cdot896hv-dreamteamdevs-projects.vercel.app/api/seo \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "title": "Project Management Software", 
    "requestId": "req_1692547890123_abc123def"
  }'
```

## 🔧 **Frontend Implementation Details**

### **Form Submission Handler:**
```typescript
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
    const data = await response.json();
    if (!data) {
      throw new Error('Empty response received');
    }
    
    setResult(data);
  } catch (err) {
    console.error('Frontend form submission error:', err);
    setError(err instanceof Error ? err.message : 'An unexpected error occurred');
  } finally {
    setLoading(false);
  }
};
```

### **Key Improvements:**
- ✅ **Explicit preventDefault()** to stop GET submission
- ✅ **Proper error handling** with try/catch and response validation
- ✅ **Unique request ID generation** for tracking
- ✅ **JSON Content-Type headers** for proper API communication
- ✅ **Loading states** and user feedback
- ✅ **Input validation** before submission

## 🌐 **n8n Integration**

### **Webhook URL Format:**
```
https://dnzsrslk.app.n8n.cloud/webhook/cb04381c-f75c-403e-8dee-0ccc087fd732
```

### **Expected n8n Payload:**
```json
{
  "title": "Product Title",
  "requestId": "req_1692547890123_abc123def"
}
```

### **n8n Response Webhook:**
```
https://seo-product-analyzer-cdot896hv-dreamteamdevs-projects.vercel.app/api/seo-results
```

## ⚡ **Performance Notes**

- **Timeout**: 60 seconds for n8n workflow processing
- **Request Tracking**: Unique IDs prevent duplicate processing
- **Error Recovery**: Proper error handling at all levels
- **Loading States**: User feedback during processing

## 🔒 **Security Features**

- **Input Validation**: Server-side validation for required fields
- **Request Sanitization**: Input trimming and validation
- **Error Handling**: Safe error messages without exposing internals
- **CORS Headers**: Proper cross-origin request handling