# Shopify SEO Workflow v2.0

## 🚀 Genel Bakış
Shopify mağazaları için özel olarak tasarlanmış, gelişmiş SEO içerik üretici workflow'u. Ana sayfa entegrasyonu ve Türkçe dil desteği ile optimize edilmiştir.

## ✨ Yeni Özellikler (v2.0)

### 🌍 Çok Dilli Destek
- **Türkçe**: Ürün ismi Türkçe ise, tüm içerik Türkçe üretilir
- **İngilizce**: Ürün ismi İngilizce ise, tüm içerik İngilizce üretilir
- **Otomatik Dil Algılama**: Türkçe karakterlere göre dil belirlenir

### 🔧 Gelişmiş İşleme
- **Gelişmiş Metin Çıkarma**: Daha akıllı parsing algoritmaları
- **Fallback Mekanizması**: AI yanıt başarısız olursa varsayılan değerler
- **Validasyon**: Her alanın doğruluğu kontrol edilir
- **Debug Bilgileri**: Detaylı işleme bilgileri

### 📊 Kapsamlı Sonuç Yapısı
```json
{
  "status": "success",
  "request_id": "unique_id",
  "timestamp": "ISO_date",
  "data": {
    "seo_title": "Max 70 karakter SEO başlık",
    "meta_description": "Max 160 karakter meta açıklama", 
    "product_description": "250-350 kelime ürün açıklaması",
    "keywords": ["anahtar", "kelimeler", "listesi"],
    "shopify_tags": ["shopify", "etiketleri"],
    "character_counts": {
      "title_length": 65,
      "meta_description_length": 155,
      "product_description_length": 320
    }
  },
  "processing_info": {
    "ai_model": "gemini-1.5-flash",
    "language_detected": "turkish",
    "extraction_success": {
      "title": true,
      "meta": true,
      "description": true,
      "keywords": true,
      "tags": true
    }
  }
}
```

## 🛠️ Kurulum

### 1. n8n'e Workflow Import Etme
```bash
# Dosyayı n8n'e import et
cp n8n/shopify-seo-workflow-v2.json /path/to/n8n/workflows/
```

### 2. Webhook URL Yapılandırması
```bash
# .env.local dosyasına ekle
N8N_SHOPIFY_WEBHOOK_V2_URL=https://your-n8n-domain.com/webhook/shopify-seo-v2
```

### 3. Google Gemini API Key
```bash
# n8n'de credentials olarak ekle
GOOGLE_GEMINI_API_KEY=your_api_key_here
```

## 🔄 Workflow Akışı

### Node'lar ve İşlevleri:

1. **Webhook** 
   - Path: `/webhook/shopify-seo-v2`
   - Method: POST
   - Frontend'den gelen istekleri karşılar

2. **Input Validation & Processing**
   - Gelen veriyi doğrular
   - Varsayılan değerleri atar
   - Unique request ID üretir
   - Timestamp ekler

3. **Shopify SEO AI Generator**
   - Google Gemini API'ye istek gönderir
   - Türkçe/İngilizce prompt desteği
   - Advanced safety settings
   - 45 saniye timeout

4. **Advanced Content Formatter**
   - AI yanıtını ayrıştırır
   - Çoklu regex pattern desteği
   - Dil algılama
   - Fallback mekanizması
   - Karakter limiti kontrolü

5. **Send to Backend**
   - Ana uygulama API'sine sonucu gönderir
   - Retry mekanizması
   - 15 saniye timeout

6. **Success Check**
   - Sonuç başarılı mı kontrol eder
   - Success/Error dalları

7. **Response Nodes**
   - Success Response: Özet bilgi
   - Error Response: Hata detayları

## 📝 Kullanım Örnekleri

### Türkçe Ürün
```json
{
  "product_name": "Bluetooth Kulaklık",
  "shopify_store_type": "dropshipping",
  "target_price_range": "25_50",
  "additional_context": "Yüksek kalite, gürültü önleyici",
  "requestId": "req_123456789"
}
```

**Çıktı:**
- SEO Başlık: "Bluetooth Kulaklık - Premium Kalite Kablosuz Müzik Deneyimi"
- Meta Açıklama: "Yüksek kaliteli Bluetooth kulaklık ile müziğin tadını çıkarın..."
- Türkçe anahtar kelimeler ve etiketler

### İngilizce Ürün
```json
{
  "product_name": "Wireless Headphones",
  "shopify_store_type": "private_label", 
  "target_price_range": "50_100",
  "additional_context": "Premium audio quality, noise cancellation",
  "requestId": "req_987654321"
}
```

**Çıktı:**
- SEO Title: "Wireless Headphones - Premium Audio Experience"
- Meta Description: "Experience crystal-clear audio with our wireless headphones..."
- İngilizce anahtar kelimeler ve etiketler

## 🎯 Optimizasyon Özellikleri

### SEO En İyi Uygulamaları
- ✅ 70 karakter SEO başlık limiti
- ✅ 160 karakter meta açıklama limiti
- ✅ Shopify arama algoritması optimizasyonu
- ✅ Ticari niyet anahtar kelimeleri
- ✅ Dönüşüm odaklı copywriting

### Shopify Özel Optimizasyonlar
- ✅ Mağaza tipi bazlı ton ayarlaması
- ✅ Fiyat aralığı konumlandırması
- ✅ Platform özel etiketleme
- ✅ İç arama optimizasyonu
- ✅ Ürün filtreleme desteği

### Performans Özellikleri
- ✅ 45 saniye AI timeout
- ✅ Retry mekanizması
- ✅ Fallback değerleri
- ✅ Hata yönetimi
- ✅ Debug bilgileri

## 🔍 Monitoring ve Debug

### Log Kontrolleri
```javascript
// n8n execution log'larında arayın:
- "Raw AI Response": AI'dan gelen ham yanıt
- "Processed Result": İşlenmiş final sonuç
- "Extraction Success": Her alanın çıkarma başarısı
```

### Hata Durumları
1. **AI Response Format Error**: Gemini API format hatası
2. **Content Extraction Failed**: Metin çıkarma başarısız
3. **Backend Send Failed**: Ana uygulamaya gönderim hatası
4. **Timeout Error**: İşlem zaman aşımı

### Başarı Metrikleri
- **Title Extraction**: SEO başlık çıkarıldı mı?
- **Meta Extraction**: Meta açıklama çıkarıldı mı?
- **Keywords Count**: Kaç anahtar kelime üretildi?
- **Character Limits**: Karakter limitleri uyuyor mu?

## 🚀 Deployment

### n8n Cloud Deployment
1. Workflow'u n8n cloud'a import edin
2. Google Gemini credentials ekleyin
3. Webhook URL'ini kopyalayın
4. Environment variable'ları güncelleyin

### Self-Hosted n8n
1. `docker-compose.yml` dosyasına workflow'u ekleyin
2. Environment variables ayarlayın
3. SSL sertifikası yapılandırın
4. Webhook security ayarlayın

## 🔒 Güvenlik

### API Key Güvenliği
- Google Gemini API key'i n8n credentials'da saklayın
- Environment variables kullanın
- API key'i kod içinde hardcode etmeyin

### Webhook Güvenliği
- HTTPS kullanın
- Request validation yapın
- Rate limiting ekleyin
- Suspicious activity monitoring

## 📊 Versiyon Karşılaştırması

| Özellik | v1.0 | v2.0 |
|---------|------|------|
| Dil Desteği | İngilizce | Türkçe + İngilizce |
| Content Parsing | Basit regex | Gelişmiş multi-pattern |
| Error Handling | Temel | Kapsamlı fallback |
| Debug Info | Minimal | Detaylı |
| Response Format | Basit | Zenginleştirilmiş |
| AI Model | Gemini 1.0 | Gemini 1.5 Flash |
| Timeout | 30s | 45s |
| Retry Logic | Yok | 2 retry |

## 📞 Destek

Workflow ile ilgili sorunlar için:
1. n8n execution log'larını kontrol edin
2. Debug bilgilerini inceleyin
3. API key'lerinin geçerli olduğunu doğrulayın
4. Network connectivity test edin

**🎯 Bu workflow, modern Shopify mağazaları için optimize edilmiş, production-ready SEO içerik üretimi sağlar!**