#!/bin/bash

# WordPecker Development Docker Startup Script

echo "🚀 Starting WordPecker App with Docker..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp .env.docker .env
    echo "✅ Created .env file. Please edit it and add your OpenAI API key."
    echo "📝 Edit .env file and set OPENAI_API_KEY=your_actual_key_here"
    exit 1
fi

# Check if OpenAI API key is set
if ! grep -q "OPENAI_API_KEY=sk-" .env && ! grep -q "OPENAI_API_KEY=your_" .env; then
    echo "⚠️  OpenAI API key not found in .env file"
    echo "📝 Please edit .env file and set OPENAI_API_KEY=your_actual_key_here"
    exit 1
fi

echo "🔧 Stopping any existing containers..."
docker-compose -f docker-compose.dev.yml down

echo "🧹 Cleaning up old images..."
docker-compose -f docker-compose.dev.yml build --no-cache

echo "🔄 Starting services..."
docker-compose -f docker-compose.dev.yml up

echo "🎉 WordPecker App should be running at:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3000"
echo "   MongoDB:  localhost:27017"