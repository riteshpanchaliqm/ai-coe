#!/bin/bash
set -e

echo "🚀 Deploying AI CoE Portal..."

# Use production env for docker-compose build args
export $(grep -v '^#' .env.production | xargs)

# Build and start containers (no Caddy — uses shared instance)
docker-compose build --no-cache
docker-compose up -d

echo ""
echo "✅ Deployment complete!"
echo ""
echo "   Containers started: aicoe-frontend, aicoe-backend"
echo "   Network: app-network (shared with Caddy)"
echo ""
echo "   ⚠️  Make sure the shared Caddyfile includes:"
echo ""
echo "   aicoe.iqm.services {"
echo "       reverse_proxy /api/* aicoe-backend:4000"
echo "       reverse_proxy /health aicoe-backend:4000"
echo "       reverse_proxy * aicoe-frontend:3000"
echo "   }"
echo ""
echo "   Then restart Caddy: docker-compose restart caddy (in the Caddy project dir)"
