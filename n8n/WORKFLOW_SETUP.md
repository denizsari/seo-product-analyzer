# n8n Workflow Setup Guide

This guide explains how to properly configure the n8n workflow to work with your Next.js application.

## Required Modifications

### 1. Update the "Prepare Final Data" Node

The current workflow needs to be modified to include the `requestId` for proper response tracking.

**Current Code in "Prepare Final Data" node:**
```javascript
// Organize the data from Code Formatting node
const items = $input.all();

let seoData = {};
let productData = {};

// Process each item
for (const item of items) {
  if (item.json.type === 'seo_meta_data') {
    seoData = {
      title: item.json.title,
      description: item.json.description,
      keywords: item.json.keywords
    };
  } else if (item.json.type === 'product_content') {
    productData = {
      product_title: item.json.product_title,
      product_description: item.json.product_description
    };
  }
}

// Combine everything into final structure
const finalData = {
  timestamp: new Date().toISOString(),
  status: 'success',
  data: {
    seo_meta: seoData,
    product_content: productData
  },
  original_request: {
    product: $node['Edit Fields'].json.product
  }
};

return [{ json: finalData }];
```

**Updated Code (ADD THIS):**
```javascript
// Organize the data from Code Formatting node
const items = $input.all();

let seoData = {};
let productData = {};

// Process each item
for (const item of items) {
  if (item.json.type === 'seo_meta_data') {
    seoData = {
      title: item.json.title,
      description: item.json.description,
      keywords: item.json.keywords
    };
  } else if (item.json.type === 'product_content') {
    productData = {
      product_title: item.json.product_title,
      product_description: item.json.product_description
    };
  }
}

// Combine everything into final structure
const finalData = {
  timestamp: new Date().toISOString(),
  status: 'success',
  data: {
    seo_meta: seoData,
    product_content: productData
  },
  original_request: {
    product: $node['Edit Fields'].json.product,
    requestId: $node['Webhook'].json.requestId  // ← ADD THIS LINE
  }
};

return [{ json: finalData }];
```

### 2. Update the "Send to Backend" Node

Change the URL in the "Send to Backend" node to point to your application:

**For Local Development:**
```
http://localhost:3000/api/seo-results
```

**For Production:**
```
https://your-domain.com/api/seo-results
```

### 3. Configure API Credentials

#### Google Search API Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the "Custom Search API"
4. Create credentials (API Key)
5. Set up a Custom Search Engine at [Google CSE](https://cse.google.com/)
6. Update the "Google Search" node with your credentials:
   - `key`: Your Google API Key
   - `cx`: Your Custom Search Engine ID

#### Google Gemini API Setup:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key for Gemini
3. Configure the "Google Gemini Chat Model" node with your credentials

## Step-by-Step Configuration

### Step 1: Import the Workflow
1. Open your n8n instance
2. Click "Import from File"
3. Select the `workflow.json` file from the `n8n/` folder
4. Click "Import"

### Step 2: Configure Nodes

#### Webhook Node (Already configured)
- Path: `cb04381c-f75c-403e-8dee-0ccc087fd732`
- Method: POST
- ✅ No changes needed

#### Edit Fields Node (Already configured)
- Maps `title` to `product`
- ✅ No changes needed

#### Google Search Node
1. Click on the "Google Search" node
2. Update the parameters:
   ```
   key: YOUR_GOOGLE_API_KEY
   cx: YOUR_CUSTOM_SEARCH_ENGINE_ID
   ```

#### Google Gemini Chat Model Node
1. Click on the "Google Gemini Chat Model" node
2. Configure credentials:
   - Create new "Google Gemini API" credential
   - Add your API key from Google AI Studio

#### Prepare Final Data Node
1. Click on the "Prepare Final Data" node
2. Replace the JavaScript code with the updated version above
3. **Important**: Add the `requestId` line as shown

#### Send to Backend Node
1. Click on the "Send to Backend" node
2. Update the URL:
   - Development: `http://localhost:3000/api/seo-results`
   - Production: `https://your-domain.com/api/seo-results`

### Step 3: Test the Workflow

1. **Activate the workflow** by clicking the toggle switch
2. **Test with curl** or Postman:
   ```bash
   curl -X POST https://your-n8n-domain.com/webhook/cb04381c-f75c-403e-8dee-0ccc087fd732 \
     -H "Content-Type: application/json" \
     -d '{"title": "Project Management Software", "requestId": "test-123"}'
   ```
3. **Check the execution log** to see if all nodes complete successfully

## Environment Variables

Make sure your `.env.local` file has the correct n8n webhook URL:

```env
N8N_WEBHOOK_URL=https://your-n8n-domain.com/webhook/cb04381c-f75c-403e-8dee-0ccc087fd732
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

## Troubleshooting

### Common Issues:

1. **Timeout Errors**
   - Check if your n8n instance is accessible
   - Verify the webhook URL is correct
   - Ensure your backend URL is reachable from n8n

2. **Google Search API Errors**
   - Verify your API key is valid
   - Check your Custom Search Engine ID
   - Ensure you have sufficient API quota

3. **Gemini API Errors**
   - Verify your Gemini API key
   - Check if you have access to the Gemini 2.0 Flash model
   - Ensure your API key has the necessary permissions

4. **Request ID Not Found**
   - Make sure you've updated the "Prepare Final Data" node
   - Verify the `requestId` is being passed correctly

### Testing Tips:

1. **Use Test Mode**: Enable test mode in the frontend to bypass n8n and verify the UI
2. **Check n8n Logs**: Review execution logs in n8n for any errors
3. **Monitor Network**: Use browser dev tools to monitor API calls
4. **Start Simple**: Test with a simple product name first

## Production Checklist

- [ ] n8n workflow is imported and configured
- [ ] All API credentials are set up
- [ ] Webhook URLs point to production domain
- [ ] Environment variables are configured
- [ ] Workflow is activated in n8n
- [ ] SSL certificates are valid
- [ ] CORS is properly configured (if needed)
- [ ] Rate limiting is considered for API endpoints

## Security Notes

- Store all API keys securely in n8n credentials
- Use environment variables for sensitive configuration
- Implement rate limiting on your API endpoints
- Consider adding authentication to your webhook endpoints in production
- Regularly rotate API keys and credentials