#!/bin/bash
cd "$(dirname "$0")"
export PATH="$HOME/.local/node/bin:$PATH"
exec node node_modules/vite/bin/vite.js --host
