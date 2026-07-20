# Production Environment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Set strong `JWT_SECRET` and `JWT_REFRESH_SECRET`
- [ ] Set a production `DATABASE_URL`
- [ ] Set `FRONTEND_URL` to the deployed frontend origin only
- [ ] Configure HTTPS termination or reverse proxy
- [ ] Ensure port 80/443 are reachable
- [ ] Verify uploads volume persistence
- [ ] Verify database backup strategy and retention
- [ ] Verify Prisma migration plan and rollback plan
- [ ] Review logs and error monitoring
