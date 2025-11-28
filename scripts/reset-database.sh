#!/bin/bash

# Script to reset database with new schema
# This backs up the old database and creates a fresh one with the new account-based architecture

echo "🔄 Resetting database with new schema..."
echo ""

# Backup old database if it exists
if [ -f ".dev.db" ]; then
  TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
  BACKUP_FILE=".dev.db.backup_${TIMESTAMP}"
  echo "📦 Backing up existing database to: $BACKUP_FILE"
  cp .dev.db "$BACKUP_FILE"
  echo "✓ Backup created"
  echo ""
fi

# Remove old database and migrations
echo "🗑️  Removing old database and migrations..."
rm -f .dev.db
rm -f .dev.db-shm
rm -f .dev.db-wal
rm -rf server/database/migrations/*
echo "✓ Cleaned up"
echo ""

# Generate new migrations from schema
echo "🔨 Generating new migrations from updated schema..."
npx drizzle-kit generate
echo "✓ Migrations generated"
echo ""

# Push migrations to database (creates tables)
echo "📤 Pushing migrations to database..."
npx drizzle-kit push
echo "✓ Database schema created"
echo ""

# Seed with default themes
echo "🌱 Seeding default themes..."
npx tsx scripts/seed-themes.ts
echo "✓ Themes seeded"
echo ""

echo "✅ Database reset complete!"
echo ""
echo "Next steps:"
echo "1. Start the dev server: npm run dev"
echo "2. Register a new user - this will auto-create an account"
echo "3. Create a website under that account"
