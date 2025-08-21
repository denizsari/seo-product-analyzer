import { NextApiRequest, NextApiResponse } from 'next';

interface CorsOptions {
  origin?: string | string[] | boolean;
  methods?: string[];
  allowedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

const DEFAULT_CORS_OPTIONS: CorsOptions = {
  origin: '*', // Allow all origins for development. In production, specify your frontend domain(s)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false,
  maxAge: 86400, // 24 hours
};

export function setCorsHeaders(res: NextApiResponse, options: CorsOptions = {}) {
  const corsOptions = { ...DEFAULT_CORS_OPTIONS, ...options };

  // Set Access-Control-Allow-Origin
  if (corsOptions.origin === true) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (typeof corsOptions.origin === 'string') {
    res.setHeader('Access-Control-Allow-Origin', corsOptions.origin);
  } else if (Array.isArray(corsOptions.origin)) {
    res.setHeader('Access-Control-Allow-Origin', corsOptions.origin.join(', '));
  }

  // Set other CORS headers
  if (corsOptions.methods) {
    res.setHeader('Access-Control-Allow-Methods', corsOptions.methods.join(', '));
  }

  if (corsOptions.allowedHeaders) {
    res.setHeader('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(', '));
  }

  if (corsOptions.credentials) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  if (corsOptions.maxAge) {
    res.setHeader('Access-Control-Max-Age', corsOptions.maxAge.toString());
  }
}

export function handleCors(
  req: NextApiRequest,
  res: NextApiResponse,
  options: CorsOptions = {}
): boolean {
  // Set CORS headers
  setCorsHeaders(res, options);

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true; // Indicates that the request was handled
  }

  return false; // Continue with normal request processing
}

// Example production configuration
export const PRODUCTION_CORS_OPTIONS: CorsOptions = {
  origin: [
    'https://seo-product-analyzer.vercel.app',
    'https://your-frontend-domain.vercel.app'
  ],
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  maxAge: 86400,
};