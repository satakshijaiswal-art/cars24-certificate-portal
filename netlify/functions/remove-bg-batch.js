import parseMultipart from 'parse-multipart-data';
import { removeBackground } from './_providers.js';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  try {
    const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';
    const boundaryMatch = contentType.match(/boundary=(.+)$/);
    if (!boundaryMatch) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing multipart boundary' }) };
    }
    const bodyBuffer = Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'binary');
    const parts = parseMultipart.parse(bodyBuffer, boundaryMatch[1]).filter((p) => p.filename);
    if (parts.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'No image files provided' }) };
    }
    const results = [];
    for (const file of parts) {
      const filename = file.filename.replace(/\.[^/.]+$/, '');
      const result = await removeBackground(file.data, file.filename, file.type || 'image/png');
      if (result) {
        results.push({ filename, success: true, ...result });
      } else {
        results.push({ filename, success: false, error: 'All providers exhausted' });
      }
    }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ results }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message || 'Internal error' }) };
  }
};
