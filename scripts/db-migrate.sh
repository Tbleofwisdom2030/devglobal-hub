#!/bin/bash

set -e

echo "🗄️  Running database migrations..."

cd apps/backend

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

echo "✅ Database migrations complete!"

# Run seed if specified
if [ "$1" = "--seed" ]; then
    echo "🌱 Seeding database..."
    npx prisma db seed
    echo "✅ Database seeded!"
fi