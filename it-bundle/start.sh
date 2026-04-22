#!/bin/sh
# Start the Node API sidecar in the background
cd /sidecar
node server.js &

# Start nginx in the foreground (keeps container alive)
nginx -g "daemon off;"
