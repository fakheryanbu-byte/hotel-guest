import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import {
  analyzeDocumentImages,
  validateIncomingImages,
} from './server/geminiDocumentParser.ts';
import { sanitizeWhatsAppNumber } from './src/config/hotels.ts';
import type { HotelBranchId } from './src/types/guest.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 15;

const requestLogByIp = new Map<string, number[]>();

function isRateLimited(ip: string, now = Date.now()): boolean {
  const timestamps = (requestLogByIp.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLogByIp.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  requestLogByIp.set(ip, timestamps);
  return false;
}

function getConfiguredHotelNumbers(): Partial<Record<HotelBranchId, string>> {
  return {
    fakhr_yanbu_1: sanitizeWhatsAppNumber(process.env.HOTEL_WHATSAPP_FAKHR_YANBU_1),
    fakhr_yanbu_3: sanitizeWhatsAppNumber(process.env.HOTEL_WHATSAPP_FAKHR_YANBU_3),
    fakhr_yanbu_5: sanitizeWhatsAppNumber(process.env.HOTEL_WHATSAPP_FAKHR_YANBU_5),
    tim_hotel: sanitizeWhatsAppNumber(process.env.HOTEL_WHATSAPP_TIM_HOTEL),
  };
}

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    next();
  });

  app.use(express.json({ limit: '25mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/config', (_req, res) => {
    res.json({
      hotels: getConfiguredHotelNumbers(),
    });
  });

  app.post('/api/analyze-document', async (req, res) => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    if (isRateLimited(clientIp)) {
      res.status(429).json({
        code: 'RATE_LIMITED',
        message: 'Too many document reading requests. Please wait a moment and try again.',
      });
      return;
    }

    const apiKey = (
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.API_KEY ||
      ''
    ).trim();
    if (!apiKey) {
      res.status(503).json({
        code: 'GEMINI_NOT_CONFIGURED',
        message: 'Document reading service is not configured on the server.',
      });
      return;
    }

    const validation = validateIncomingImages(req.body?.images);
    if (!validation.ok) {
      res.status(validation.status).json({
        code: validation.code,
        message: validation.message,
      });
      return;
    }

    try {
      const data = await analyzeDocumentImages(validation.images, apiKey);
      res.json({ data });
    } catch (err) {
      // Never log document images or guest PII
      const status =
        typeof err === 'object' && err !== null && 'status' in err
          ? Number((err as { status?: unknown }).status)
          : 502;
      const errMessage = err instanceof Error ? err.message : '';
      console.error('Document analysis error status:', status || 502, errMessage.slice(0, 160));

      if (status === 403 || /API_KEY_INVALID|PERMISSION_DENIED/i.test(errMessage)) {
        res.status(502).json({
          code: 'GEMINI_AUTH_ERROR',
          message: 'Gemini API key is invalid or lacks permission.',
        });
        return;
      }
      if (status === 429 || /RESOURCE_EXHAUSTED/i.test(errMessage)) {
        res.status(429).json({
          code: 'GEMINI_QUOTA_EXCEEDED',
          message: 'Gemini API quota exceeded. Please try again shortly or check billing/quota.',
        });
        return;
      }

      res.status(502).json({
        code: 'GEMINI_FAILED',
        message: 'Could not extract document details. Please retake the photo or enter details manually.',
      });
    }
  });

  return app;
}

async function startServer() {
  const app = createApp();
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);

if (isDirectRun) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}
