# PostgreSQL Backup and Restore

## Backup
```bash
docker compose exec postgres pg_dump -U postgres -d kreasi > backup.sql
```

## Restore
```bash
cat backup.sql | docker compose exec -T postgres psql -U postgres -d kreasi
```

## Migration procedure
```bash
docker compose exec backend npx prisma migrate deploy
```

## Rollback procedure
```bash
docker compose exec backend npx prisma migrate resolve --rolled-back <migration-name>
```

> Use a database snapshot or backup before any destructive migration.
