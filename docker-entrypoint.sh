#!/bin/sh
set -e

echo "Starting application in $NODE_ENV mode..."

if [ "$NODE_ENV" = "production" ]; then
    echo "Running database migrations..."
    node dist/core/db/migrate.js
else
    echo "Running database push..."
    pnpm run db:push
fi

echo "Database setup completed. Starting application..."
exec "$@"
