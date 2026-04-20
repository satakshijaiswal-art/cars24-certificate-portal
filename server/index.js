const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fetch = require('node-fetch');
const FormData = require('form-data');
const os = require('os');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Track which APIs have exhausted their limits
const apiStatus = {
  removeBg: { exhausted: false, lastCheck: null },
  photoRoom: { exhausted: false, lastCheck: null },
  clipdrop: { exhausted: false, lastCheck: null }
};

// Reset exhausted status every hour (in case limits reset)
setInterval(() => {
  Object.keys(apiStatus).forEach(key => {
    apiStatus[key].exhausted = false;
  });
  console.log('API status reset - all APIs available');
}, 60 * 60 * 1000);

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG and PNG are allowed.'));
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', apis: apiStatus });
});

// ============ API PROVIDERS ============

// 1. Remove.bg API (50 free/month)
async function removeWithRemoveBg(fileBuffer, filename, mimetype) {
  const apiKey = process.env.REMOVE_BG_API_KEY;
  if (!apiKey || apiStatus.removeBg.exhausted) {
    return null;
  }

  try {
    const formData = new FormData();
    formData.append('image_file', fileBuffer, { filename, contentType: mimetype });
    formData.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': apiKey },
      body: formData
    });

    if (response.status === 402 || response.status === 403) {
      console.log('Remove.bg: Credit limit reached or invalid key');
      apiStatus.removeBg.exhausted = true;
      apiStatus.removeBg.lastCheck = new Date();
      return null;
    }

    if (!response.ok) {
      console.log('Remove.bg: Request failed', response.status);
      return null;
    }

    const imageBuffer = await response.buffer();
    console.log('Remove.bg: Success');
    return `data:image/png;base64,${imageBuffer.toString('base64')}`;
  } catch (error) {
    console.error('Remove.bg error:', error.message);
    return null;
  }
}

// 2. PhotoRoom API (100 free/month)
async function removeWithPhotoRoom(fileBuffer, filename, mimetype) {
  const apiKey = process.env.PHOTOROOM_API_KEY;
  if (!apiKey || apiStatus.photoRoom.exhausted) {
    return null;
  }

  try {
    const formData = new FormData();
    formData.append('image_file', fileBuffer, { filename, contentType: mimetype });

    const response = await fetch('https://sdk.photoroom.com/v1/segment', {
      method: 'POST',
      headers: { 'x-api-key': apiKey },
      body: formData
    });

    if (response.status === 402 || response.status === 403 || response.status === 429) {
      console.log('PhotoRoom: Credit limit reached or rate limited');
      apiStatus.photoRoom.exhausted = true;
      apiStatus.photoRoom.lastCheck = new Date();
      return null;
    }

    if (!response.ok) {
      console.log('PhotoRoom: Request failed', response.status);
      return null;
    }

    const imageBuffer = await response.buffer();
    console.log('PhotoRoom: Success');
    return `data:image/png;base64,${imageBuffer.toString('base64')}`;
  } catch (error) {
    console.error('PhotoRoom error:', error.message);
    return null;
  }
}

// 3. Clipdrop API (100 free credits/month)
async function removeWithClipdrop(fileBuffer, filename, mimetype) {
  const apiKey = process.env.CLIPDROP_API_KEY;
  if (!apiKey || apiStatus.clipdrop.exhausted) {
    return null;
  }

  try {
    const formData = new FormData();
    formData.append('image_file', fileBuffer, { filename, contentType: mimetype });

    const response = await fetch('https://clipdrop-api.co/remove-background/v1', {
      method: 'POST',
      headers: { 'x-api-key': apiKey },
      body: formData
    });

    if (response.status === 402 || response.status === 403 || response.status === 429) {
      console.log('Clipdrop: Credit limit reached or rate limited');
      apiStatus.clipdrop.exhausted = true;
      apiStatus.clipdrop.lastCheck = new Date();
      return null;
    }

    if (!response.ok) {
      console.log('Clipdrop: Request failed', response.status);
      return null;
    }

    const imageBuffer = await response.buffer();
    console.log('Clipdrop: Success');
    return `data:image/png;base64,${imageBuffer.toString('base64')}`;
  } catch (error) {
    console.error('Clipdrop error:', error.message);
    return null;
  }
}

// ============ MAIN ENDPOINT WITH FALLBACK ============

app.post('/api/remove-bg', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { buffer, originalname, mimetype } = req.file;
    let result = null;
    let usedApi = null;

    // Try APIs in order until one succeeds
    const apis = [
      { name: 'remove.bg', fn: removeWithRemoveBg },
      { name: 'photoroom', fn: removeWithPhotoRoom },
      { name: 'clipdrop', fn: removeWithClipdrop }
    ];

    for (const api of apis) {
      console.log(`Trying ${api.name}...`);
      result = await api.fn(buffer, originalname, mimetype);
      if (result) {
        usedApi = api.name;
        break;
      }
    }

    if (!result) {
      return res.status(503).json({ 
        error: 'All background removal APIs are exhausted or unavailable. Please try again later or check API keys.',
        apiStatus 
      });
    }

    res.json({ 
      success: true, 
      processedImage: result,
      usedApi
    });

  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: error.message || 'Failed to process image' });
  }
});

// Batch background removal endpoint
app.post('/api/remove-bg-batch', upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No image files provided' });
    }

    const results = [];
    
    for (const file of req.files) {
      const { buffer, originalname, mimetype } = file;
      let result = null;
      let usedApi = null;

      // Try APIs in order
      const apis = [
        { name: 'remove.bg', fn: removeWithRemoveBg },
        { name: 'photoroom', fn: removeWithPhotoRoom },
        { name: 'clipdrop', fn: removeWithClipdrop }
      ];

      for (const api of apis) {
        result = await api.fn(buffer, originalname, mimetype);
        if (result) {
          usedApi = api.name;
          break;
        }
      }

      const filename = originalname.replace(/\.[^/.]+$/, '');
      
      if (result) {
        results.push({
          filename,
          success: true,
          processedImage: result,
          usedApi
        });
      } else {
        results.push({
          filename,
          success: false,
          error: 'All APIs exhausted'
        });
      }
    }

    res.json({ results, apiStatus });

  } catch (error) {
    console.error('Error processing batch:', error);
    res.status(500).json({ error: error.message || 'Failed to process images' });
  }
});

// Get API status
app.get('/api/status', (req, res) => {
  const configured = {
    removeBg: !!process.env.REMOVE_BG_API_KEY,
    photoRoom: !!process.env.PHOTOROOM_API_KEY,
    clipdrop: !!process.env.CLIPDROP_API_KEY
  };
  res.json({ configured, status: apiStatus });
});

// Reset a specific API status (manual override)
app.post('/api/reset-status/:api', (req, res) => {
  const { api } = req.params;
  if (apiStatus[api]) {
    apiStatus[api].exhausted = false;
    apiStatus[api].lastCheck = null;
    res.json({ success: true, message: `${api} status reset` });
  } else {
    res.status(400).json({ error: 'Invalid API name' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  res.status(500).json({ error: error.message || 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  // Collect LAN IPv4 addresses so we can print a shareable URL
  const nets = os.networkInterfaces();
  const lanIps = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        lanIps.push(net.address);
      }
    }
  }
  console.log(`Server running on http://localhost:${PORT}`);
  lanIps.forEach(ip => console.log(`                   http://${ip}:${PORT}  (LAN)`));
  console.log('Configured APIs:');
  console.log('  - Remove.bg:', process.env.REMOVE_BG_API_KEY ? '✓' : '✗');
  console.log('  - PhotoRoom:', process.env.PHOTOROOM_API_KEY ? '✓' : '✗');
  console.log('  - Clipdrop:', process.env.CLIPDROP_API_KEY ? '✓' : '✗');
});
