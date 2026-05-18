#!/bin/bash
set -e

echo "🚀 Deploying AI CoE Portal..."

# Use production env for docker-compose build args
export $(grep -v '^#' .env.production | xargs)

# Copy production backend env
cp backend/.env.production backend/.env

# Build and start containers
docker-compose build --no-cache
docker-compose up -d

echo ""
echo "✅ Deployment complete!"
echo "   🌐 Frontend: https://aicoe.iqm.services"
echo "   🔌 API:      https://aicoe.iqm.services/api/v1/ai-coe"
echo "   💚 Health:   https://aicoe.iqm.services/health"
echo ""
echo "   Logs: docker-compose logs -f"
