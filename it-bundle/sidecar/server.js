/**
 * Cars24 Certificate Portal — Background-Removal API Sidecar
 *
 * This tiny Express server proxies background-removal requests to external
 * cloud APIs (remove.bg / PhotoRoom / Clipdrop).
 *
 * If NONE of the API keys are set in the environment, this server still starts
 * and returns a 503 on /api/remove-bg. The browser then falls back to the
 * in-browser @imgly/background-removal library automatically — so the app
 * works 100% offline / without any API keys.
 *
 * Port: 3001 (proxied from nginx /api/* → this server)
 */

import express from 'express';
import multer from 'multer';

const app = express();
const PORT = 3001;

// Multer stores file in memory (max 20 MB)
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

// ── Helpers ──────────────────────────────────────────────────────────────────

async function tryRemoveBg(buffer, mimetype) {
  const apiKey = process.env.REMOVE_BG_API_KEY;
  if (!apiKey) return null;
  const fd = new FormData();
  fd.append('image_file', new Blob([buffer], { type: mimetype }), 'photo.png');
  fd.append('size', 'auto');
  const res = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: { 'X-Api-Key': apiKey },
    body: fd,
  });
  if (!res.ok) return null;
  const ab = await res.arrayBuffer();
  return `data:image/png;base64,${Buffer.from(ab).toString('base64')}`;
}

async function tryPhotoRoom(buffer, mimetype) {
  const apiKey = process.env.PHOTOROOM_API_KEY;
  if (!apiKey) return null;
  const fd = new FormData();
  fd.append('image_file', new Blob([buffer], { type: mimetype }), 'photo.png');
  const res = await fetch('https://sdk.photoroom.com/v1/segment', {
    method: 'POST',
    headers: { 'x-api-key': apiKey },
    body: fd,
  });
  if (!res.ok) return null;
  const ab = await res.arrayBuffer();
  return `data:image/png;base64,${Buffer.from(ab).toString('base64')}`;
}

async function tryClipdrop(buffer, mimetype) {
  const apiKey = process.env.CLIPDROP_API_KEY;
  if (!apiKey) return null;
  const fd = new FormData();
  fd.append('image_file', new Blob([buffer], { type: mimetype }), 'photo.png');
  const res = await fetch('https://clipdrop-api.co/remove-background/v1', {
    method: 'POST',
    headers: { 'x-api-key': apiKey },
    body: fd,
  });
  if (!res.ok) return null;
  const ab = await res.arrayBuffer();
  return `data:image/png;base64,${Buffer.from(ab).toString('base64')}`;
}

// ── Routes ───────────────────────────────────────────────────────────────────

// Single image background removal
app.post('/api/remove-bg', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  const { buffer, mimetype } = req.file;

  try {
    for (const fn of [tryRemoveBg, tryPhotoRoom, tryClipdrop]) {
      const result = await fn(buffer, mimetype);
      if (result) {
        return res.json({ success: true, processedImage: result });
      }
    }
    // No API keys configured — browser will use @imgly fallback
    return res.status(503).json({
      error: 'No background-removal API keys configured. The browser will use the offline fallback.',
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
});

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', keys: {
  removeBg: !!process.env.REMOVE_BG_API_KEY,
  photoRoom: !!process.env.PHOTOROOM_API_KEY,
  clipdrop: !!process.env.CLIPDROP_API_KEY,
}}));

app.listen(PORT, () => {
  const keys = [
    process.env.REMOVE_BG_API_KEY ? 'remove.bg' : null,
    process.env.PHOTOROOM_API_KEY ? 'PhotoRoom' : null,
    process.env.CLIPDROP_API_KEY ? 'Clipdrop' : null,
  ].filter(Boolean);

  console.log(`Cars24 API sidecar running on port ${PORT}`);
  if (keys.length === 0) {
    console.log('No API keys set — browser will use @imgly offline fallback for background removal');
  } else {
    console.log(`Active background-removal providers: ${keys.join(', ')}`);
  }
});
