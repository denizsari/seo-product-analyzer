# SEO Product Analyzer

A Next.js application that integrates with n8n workflows to provide automated SEO analysis for product titles using Google Search and AI-powered content generation.

## Features

- 🔍 Automated SEO analysis using n8n workflows
- 🤖 AI-powered meta data and content generation
- 🎨 Modern, responsive UI with TailwindCSS
- ⚡ Real-time workflow processing with webhook integration
- 🛡️ Comprehensive error handling and validation

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file with your configuration:

```env
# n8n Configuration
N8N_WEBHOOK_URL=https://your-n8n-domain.com/webhook/cb04381c-f75c-403e-8dee-0ccc087fd732
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000

# Google Search API (for n8n workflow)
GOOGLE_SEARCH_API_KEY=your_google_api_key_here
GOOGLE_SEARCH_CX=your_google_cx_here
```

### 3. Configure n8n Workflow

1. Import the workflow from `n8n/workflow.json` into your n8n instance
2. Update the webhook URL in the "Send to Backend" node to point to your deployed application:
   ```
   https://your-backend-domain.com/api/seo-results
   ```
3. Configure your Google Search API credentials in the workflow
4. Configure your Google Gemini API credentials in the workflow
5. Activate the workflow

### 4. Update n8n Workflow Configuration

In your n8n workflow, make sure to:

1. **Edit the "Prepare Final Data" node** to include the requestId:
   ```javascript
   // Add this line to include the requestId in the final data
   original_request: {
     product: $node['Edit Fields'].json.product,
     requestId: $node['Webhook'].json.requestId  // Add this line
   }
   ```

2. **Update the "Send to Backend" node** URL to your deployed domain:
   ```
   https://your-deployed-app.com/api/seo-results
   ```

### 5. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

## How It Works

1. **User Input**: User enters a product title on the frontend
2. **API Trigger**: Frontend calls `/api/seo` which triggers the n8n workflow
3. **n8n Processing**: 
   - Receives the product title via webhook
   - Performs Google Search for competitor analysis
   - Uses AI (Google Gemini) to generate SEO-optimized content
   - Formats and prepares the final result
4. **Webhook Response**: n8n sends the result back to `/api/seo-results`
5. **Frontend Display**: The structured SEO data is displayed in a clean, organized format

## API Endpoints

### `POST /api/seo`
Triggers the n8n workflow for SEO analysis.

**Request Body:**
```json
{
  "product": "Your Product Title"
}
```

**Response:**
```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "status": "success",
  "data": {
    "seo_meta": {
      "title": "SEO optimized title",
      "description": "SEO meta description",
      "keywords": "relevant, keywords, list"
    },
    "product_content": {
      "product_title": "Product title",
      "product_description": "Detailed product description"
    }
  }
}
```

### `POST /api/seo-results`
Receives webhook results from n8n workflow.

## Project Structure

```
├── pages/
│   ├── api/
│   │   ├── seo.ts              # Main API endpoint to trigger workflow
│   │   └── seo-results.ts      # Webhook endpoint for n8n results
│   ├── index.tsx               # Main frontend page
│   └── _app.tsx               # App wrapper with global styles
├── n8n/
│   └── workflow.json          # n8n workflow configuration
├── styles/
│   └── globals.css            # TailwindCSS styles
└── README.md
```

## Troubleshooting

1. **Timeout Issues**: The workflow has a 60-second timeout. If your n8n workflow takes longer, increase the timeout in `/api/seo.ts`

2. **Webhook Not Receiving Data**: Ensure your deployed application URL is correctly configured in the n8n "Send to Backend" node

3. **Google Search Errors**: Verify your Google Search API key and Custom Search Engine ID are correctly configured in the n8n workflow

4. **AI Generation Errors**: Check your Google Gemini API credentials in the n8n workflow

## Production Deployment

1. Deploy to your preferred platform (Vercel, Netlify, etc.)
2. Update the n8n workflow "Send to Backend" node with your production URL
3. Configure environment variables in your deployment platform
4. Ensure your n8n instance is accessible from your deployed application

## License

MIT