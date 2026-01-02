#!/bin/bash

echo "=========================================="
echo "  MineCraft Bot Assistant - Docker Build"
echo "=========================================="

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed"
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "Error: Docker Compose is not installed"
    exit 1
fi

# Create .env file if not exists
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
fi

echo ""
echo "Building and starting containers..."
echo ""

# Use docker compose (v2) or docker-compose (v1)
if docker compose version &> /dev/null; then
    docker compose up -d --build
else
    docker-compose up -d --build
fi

echo ""
echo "=========================================="
echo "  MineCraft Bot Assistant is running!"
echo "=========================================="
echo ""
echo "  Web UI: http://localhost:3000"
echo ""
echo "  To view logs: docker logs -f minebot-assistant"
echo "  To stop: docker compose down"
echo ""
