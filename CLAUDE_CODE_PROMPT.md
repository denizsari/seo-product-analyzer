# /shopify

# Claude Code - Shopify SEO Feature Development

## 🎯 Proje Durumu
Mevcut Next.js 14 + TypeScript projesine Shopify SEO özelliği ekliyoruz. n8n workflow hazır, frontend + backend entegrasyonu gerekiyor.

## 📋 Görevler

### 1. Proje İncelemesi
- Mevcut kod yapısını analiz et
- `/pages/api/` altındaki API yapısını incele  
- Frontend component pattern'ini gözden geçir
- Styling approach'unu (TailwindCSS) değerlendir

### 2. Shopify SEO Sayfası
**Yol:** `/pages/shopify-seo.tsx`

**Gereksinimler:**
- Basit, temiz form UI (TailwindCSS)
- Input alanları: product_name (required), shopify_store_type (dropdown), target_price_range (dropdown), additional_context (optional)
- Real-time character counter (title: 70, meta: 160)
- Loading state ve result display
- Copy-to-clipboard functionality
- Responsive design

**Form Alanları:**
```
- Product Name: Text input (required)
- Store Type: Dropdown [dropshipping, private_label, wholesale, handmade]
- Price Range: Dropdown [under_25, 25_50, 50_100, 100_plus]  
- Additional Context: Textarea (optional)
```

### 3. Backend API
**Yol:** `/pages/api/shopify-seo.ts`

**Gereksinimler:**
- POST endpoint 
- Input validation
- n8n workflow integration (webhook call)
- Error handling
- CORS setup (mevcut pattern'e uygun)
- Response formatting

**n8n Webhook:** 
- URL: `http://localhost:5678/webhook/shopify-seo`
- Method: POST
- Headers: Content-Type: application/json

### 4. Response Format
```json
{
  "status": "success|error",
  "data": {
    "seo_title": "string",
    "meta_description": "string", 
    "product_description": "string",
    "keywords": ["array"],
    "shopify_tags": ["array"],
    "character_counts": {
      "title_length": number,
      "meta_description_length": number
    }
  },
  "error": "string (if error)"
}
```

## 🔧 Teknik Detaylar

### API Integration Pattern
Mevcut `/api/seo.ts` dosyasındaki pattern'i takip et:
- Async request handling
- Error boundaries  
- Timeout management
- Clean response format

### UI Components
Mevcut `/pages/index.tsx` component pattern'ini kullan:
- useState hooks for form data
- Submit handler with loading states
- Result display component
- Error handling UI

### Styling
TailwindCSS classes kullan:
- Modern, minimal design
- Responsive layout
- Loading spinners
- Success/error states

## ⚡ Optimizasyon
- Token efficient code
- Minimal dependencies
- Reuse existing patterns
- Clean, readable code
- Proper TypeScript types

## 🧪 Test Hazırlığı
Test edilebilir kod yaz:
- Console log'lar ekle
- Clear error messages
- Validation feedback
- Debug friendly

Bu prompt'u kullanarak Shopify SEO feature'ını geliştir. Mevcut proje yapısına uyumlu, test edilebilir kod üret.
