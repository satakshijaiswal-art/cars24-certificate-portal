# Background Removal Server

This server provides background removal with **automatic fallback** across multiple APIs. When one API's free limit is exhausted, it automatically switches to the next available API.

## 🚀 Total Free Capacity: ~250 images/month

| API | Free Tier | Get API Key |
|-----|-----------|-------------|
| Remove.bg | 50/month | https://www.remove.bg/api |
| PhotoRoom | 100/month | https://www.photoroom.com/api |
| Clipdrop | 100/month | https://clipdrop.co/apis |

## Setup

1. **Get API keys** (add as many as you want):
   - Sign up at each service above
   - Get your free API keys

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

3. **Add your API keys to `.env`:**
   ```env
   # Add any/all of these - server will use them in order
   REMOVE_BG_API_KEY=your_key_here
   PHOTOROOM_API_KEY=your_key_here
   CLIPDROP_API_KEY=your_key_here
   PORT=3001
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Start the server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

## How Fallback Works

1. Server tries **Remove.bg** first
2. If limit reached (402/403), marks it as exhausted and tries **PhotoRoom**
3. If PhotoRoom exhausted, tries **Clipdrop**
4. If all exhausted, returns error (resets hourly)

```
Request → Remove.bg ✓ → Success
              ↓ (exhausted)
         PhotoRoom ✓ → Success
              ↓ (exhausted)
         Clipdrop ✓ → Success
              ↓ (exhausted)
         Error: All APIs exhausted
```

## API Endpoints

### POST /api/remove-bg
Remove background from a single image.

**Response:**
```json
{
  "success": true,
  "processedImage": "data:image/png;base64,...",
  "usedApi": "remove.bg"
}
```

### POST /api/remove-bg-batch
Remove background from multiple images (max 20).

### GET /api/status
Check which APIs are configured and their status.

```json
{
  "configured": {
    "removeBg": true,
    "photoRoom": true,
    "clipdrop": false
  },
  "status": {
    "removeBg": { "exhausted": false },
    "photoRoom": { "exhausted": true, "lastCheck": "2024-..." },
    "clipdrop": { "exhausted": false }
  }
}
```

### POST /api/reset-status/:api
Manually reset an API's exhausted status.

## Error Handling

- **400**: Invalid file type or no file provided
- **503**: All APIs exhausted (try again in ~1 hour)
- **500**: Server error

## Limits

- Maximum file size: 10MB
- Supported formats: JPG, PNG
- API status resets every hour automatically
