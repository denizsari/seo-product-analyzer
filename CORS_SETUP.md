# 🌐 CORS Configuration Guide

## ✅ **CORS Support Added**

All API routes now support Cross-Origin Resource Sharing (CORS) for cross-domain requests.

## 📋 **What Was Implemented**

### 1. **Centralized CORS Utility** (`utils/cors.ts`)
- **Reusable CORS configuration**
- **Customizable options** for different environments
- **Production-ready** with security best practices

### 2. **CORS Headers Set**
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
Access-Control-Max-Age: 86400 (24 hours)
```

### 3. **Preflight OPTIONS Handling**
- **Automatic OPTIONS response** with 200 status
- **Proper preflight headers** for complex requests
- **24-hour cache** for preflight responses

## 🔧 **API Routes Updated**

All endpoints now support CORS:
- ✅ `/api/seo` - Main SEO processing endpoint
- ✅ `/api/seo-results` - Webhook response handler  
- ✅ `/api/test-seo` - Test mode endpoint

## 🧪 **Testing CORS**

### **Test Preflight (OPTIONS):**
```bash
curl -X OPTIONS https://seo-product-analyzer.vercel.app/api/test-seo \
  -H "Origin: https://your-frontend-domain.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" -v
```

**Expected Response:**
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
Access-Control-Max-Age: 86400
```

### **Test POST Request:**
```bash
curl -X POST https://seo-product-analyzer.vercel.app/api/test-seo \
  -H "Content-Type: application/json" \
  -H "Origin: https://your-frontend-domain.com" \
  -d '{"title": "CORS Test", "requestId": "test-123"}' -v
```

**Expected Response:** JSON data with CORS headers included.

## ⚙️ **Configuration Options**

### **Default Configuration (Development):**
```typescript
{
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false,
  maxAge: 86400
}
```

### **Production Configuration:**
```typescript
import { PRODUCTION_CORS_OPTIONS } from '../utils/cors';

// In your API route:
if (handleCors(req, res, PRODUCTION_CORS_OPTIONS)) {
  return;
}
```

**Production settings:**
```typescript
{
  origin: [
    'https://seo-product-analyzer.vercel.app',
    'https://your-frontend-domain.vercel.app'
  ],
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  maxAge: 86400
}
```

## 🔒 **Security Considerations**

### **For Production:**

1. **Restrict Origins**: Replace `'*'` with specific frontend domains
   ```typescript
   origin: ['https://your-frontend-domain.com']
   ```

2. **Limit Methods**: Only allow necessary HTTP methods
   ```typescript
   methods: ['POST', 'OPTIONS']
   ```

3. **Minimal Headers**: Only allow required headers
   ```typescript
   allowedHeaders: ['Content-Type']
   ```

### **Example Secure Configuration:**
```typescript
const SECURE_CORS_OPTIONS = {
  origin: [
    'https://seo-product-analyzer.vercel.app',
    'https://your-production-frontend.com'
  ],
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
  maxAge: 3600 // 1 hour
};
```

## 🚀 **Using from Frontend**

### **JavaScript/React Example:**
```javascript
// This will now work from any domain
const response = await fetch('https://seo-product-analyzer.vercel.app/api/test-seo', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Product Title',
    requestId: 'unique-id-123'
  })
});

const data = await response.json();
```

### **With Error Handling:**
```javascript
try {
  const response = await fetch('https://seo-product-analyzer.vercel.app/api/seo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: productTitle,
      requestId: generateRequestId()
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  // Handle success
} catch (error) {
  // Handle CORS or network errors
  console.error('CORS or network error:', error);
}
```

## 🔄 **Browser Behavior**

### **Simple Requests** (automatic):
- `GET`, `POST` with standard headers
- No preflight needed

### **Complex Requests** (with preflight):
- Custom headers like `Authorization`
- Methods like `PUT`, `DELETE`
- Browser automatically sends OPTIONS first

## 📊 **Troubleshooting CORS Issues**

### **Common Problems:**

1. **"CORS policy blocked"**
   - **Solution**: Ensure API includes proper CORS headers

2. **Preflight fails**
   - **Solution**: Check OPTIONS handling returns 200

3. **Credentials issues**
   - **Solution**: Set `credentials: true` if needed

4. **Origin not allowed**
   - **Solution**: Add your domain to allowed origins

### **Debug Tips:**
- **Check browser Network tab** for preflight requests
- **Verify CORS headers** in response
- **Test with curl** to isolate browser issues

## ✅ **Ready for Cross-Domain Requests**

Your API now supports requests from any frontend domain. For production, remember to restrict the allowed origins for security!