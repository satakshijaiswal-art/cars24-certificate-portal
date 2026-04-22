# ─────────────────────────────────────────────────────────────────────────────
# Stage 1: Build the React/Vite frontend
# ─────────────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY app/package*.json ./
RUN npm ci --prefer-offline

# Copy source and build
COPY app/ ./
RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2: API sidecar (Node/Express) for background-removal proxy
# Runs on port 3001 internally. Falls back gracefully if no API keys are set.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS sidecar-builder

WORKDIR /sidecar
COPY sidecar/package*.json ./
RUN npm ci --prefer-offline
COPY sidecar/ ./

# ─────────────────────────────────────────────────────────────────────────────
# Stage 3: Final image — nginx serves the frontend, Node sidecar for /api/*
# ─────────────────────────────────────────────────────────────────────────────
FROM nginx:alpine

# Install Node.js in the nginx image (for the sidecar)
RUN apk add --no-cache nodejs npm

# Copy the built frontend into nginx's web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the sidecar
COPY --from=sidecar-builder /sidecar /sidecar

# Custom nginx config: proxy /api/* to the Node sidecar
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Startup script: launch both nginx and the sidecar
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]
