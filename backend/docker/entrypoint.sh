#!/bin/sh
set -e

echo "[entrypoint] applying database migrations ..."
npx prisma migrate deploy

echo "[entrypoint] starting CS Project and Idea Hub"
exec "$@"
