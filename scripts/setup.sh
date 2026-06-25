#!/bin/bash

set -e

echo "=========================================="
echo "🚀 DevGlobal Hub - Project Setup"
echo "=========================================="

# Check Node.js version
echo "📋 Checking Node.js version..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js 20+ is required. Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js $(node -v) detected"

# Check pnpm
echo "📋 Checking pnpm..."
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi
echo "✅ pnpm $(pnpm -v) detected"

# Copy environment files
echo "📋 Setting up environment files..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env from .env.example"
else
    echo "⚠️  .env already exists, skipping"
fi

if [ ! -f apps/backend/.env ]; then
    cp apps/backend/.env.example apps/backend/.env
    echo "✅ Created apps/backend/.env"
fi

if [ ! -f apps/frontend/.env.local ]; then
    cp apps/frontend/.env.example apps/frontend/.env.local
    echo "✅ Created apps/frontend/.env.local"
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
cd apps/backend
npx prisma generate
cd ../..

# Setup git hooks
echo "🔧 Setting up git hooks..."
npx husky install 2>/dev/null || true

# Build shared packages
echo "🏗️  Building shared packages..."
pnpm turbo build --filter=@devglobal/shared

echo ""
echo "=========================================="
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env files with your API keys"
echo "2. Run: docker-compose up -d (start services)"
echo "3. Run: pnpm db:migrate (run database migrations)"
echo "4. Run: pnpm db:seed (seed database)"
echo "5. Run: pnpm dev (start development)"
echo "=========================================="