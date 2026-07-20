# Deployment Guide

## 1. Prerequisites
- Docker Engine 24+ and Docker Compose v2
- A PostgreSQL instance or Docker-based PostgreSQL service
- A host with sufficient disk space for uploads and database persistence
- Secure values for `JWT_SECRET` and `JWT_REFRESH_SECRET`

## 2. Environment preparation
1. Copy [.env.example](../.env.example) to `.env`.
2. Set production-safe values for:
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `DATABASE_URL`
   - `FRONTEND_URL`
3. Ensure the host can expose the required ports (80/443, 3000, 5432 if needed).

## 3. Build and start
```bash
docker compose up --build -d
```

For production overrides:
```bash
docker compose -f docker-compose.yml -f docker-compose.production.yml up --build -d
```

## 4. Apply Prisma migrations
```bash
docker compose exec backend npx prisma migrate deploy
```

## 5. Verify services
- Backend health: `http://localhost:3000/api/health`
- Frontend: `http://localhost/`
- Database readiness: `docker compose ps`

## 6. Persistent uploads
Uploads are stored in the `uploads_data` Docker volume and are retained across container restarts.

## 7. Graceful shutdown
The backend is wired to handle `SIGTERM`/`SIGINT` and to disconnect Prisma cleanly.
