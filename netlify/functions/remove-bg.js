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
    const parts = parseMultipart.parse(bodyBuffer, boundaryMatch[1]);
    const file = parts.find((p) => p.filename);
    if (!file) {
      return { statusCode: 400, body: JSON.stringify({ error: 'No image file provided' }) };
    }
    const result = await removeBackground(file.data, file.filename, file.type || 'image/png');
    if (!result) {
      return {
        statusCode: 503,
        body: JSON.stringify({ error: 'Background-removal providers unavailable. Configure API keys in Netlify env vars.' }),
      };
    }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, ...result }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message || 'Internal error' }) };
  }
};
