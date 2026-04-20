# Cars24 Certificate Portal — IT Deployment Guide

## What this is

A web application used by the HR / People team to generate award certificates
and recognition slide decks for quarterly RnR cycles. Employees upload a
headshot, pick an award template, fill in names, and download a PDF certificate
or PowerPoint deck. All core functionality runs in the browser — no database or
cloud services required.

---

## Option 1: Docker (recommended)

**Requirements:** Docker Desktop (or Docker Engine on Linux) installed on the
host machine.

```bash
# 1. Unzip this bundle and enter the folder
cd cars24-cert-it-bundle

# 2. (Optional) copy the env example and add API keys — see section below
cp .env.example .env
# edit .env if you have background-removal API keys

# 3. Launch — that's it
docker compose up -d

# The portal is now available at http://<server-ip>/
# To stop:  docker compose down
```

To change the port (e.g. if port 80 is occupied), edit docker-compose.yml and
change `"80:80"` to `"8080:80"`, then restart.

---

## Option 2: Static folder on any web server (IIS / Apache / nginx)

The `dist/` folder inside this bundle is a fully pre-built static site.
Copy it to any web server's document root.

**nginx (one-liner):**
```bash
docker run -p 80:80 -v $(pwd)/dist:/usr/share/nginx/html:ro nginx:alpine
```

**Python (zero-install test):**
```bash
cd dist
python3 -m http.server 8080
# Open http://localhost:8080
```

**IIS:** Create a new site, set the physical path to the `dist\` folder,
enable static content. No server-side components needed.

**Apache:** Drop `dist/` contents into `htdocs/`. Add a `.htaccess` with
`FallbackResource /index.html` so browser-side routing works.

> Note: Without the Docker sidecar, the "remove background" button falls back
> to in-browser processing automatically. No action needed — it just works.

---

## Optional: Background removal API keys

Without any API keys the app still works fully — employee photos are processed
locally inside the browser using an AI model bundled with the app (no internet
required after the page loads).

If faster cloud processing is preferred, add any of these keys to the `.env`
file before running Docker:

| Variable | Provider | Free tier |
|---|---|---|
| `REMOVE_BG_API_KEY` | remove.bg | 50 images/month |
| `PHOTOROOM_API_KEY` | PhotoRoom | 100 images/month |
| `CLIPDROP_API_KEY` | Clipdrop | 100 images/month |

The app tries each key in order and falls back to in-browser processing if all
fail.

---

## How employees use it

1. Open the portal URL in any modern browser (Chrome, Edge, Firefox, Safari).
2. Log in with their Cars24 email (password: `cars24@2024` — HR can change
   this in the LoginPage component if needed).
3. Choose Certificate or PPT Creator.
4. Upload an Excel sheet of nominee names, or add certificates one by one.
5. Download as PDF or PowerPoint.

No installation, no accounts, no data stored server-side.

---

*Contact: satakshi.jaiswal@cars24.com for questions about the app.*
