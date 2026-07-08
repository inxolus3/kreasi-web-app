# Secret Rotation & Git History Cleanup

This document lists recommended steps to rotate secrets and remove sensitive files from git history.

## 1) Rotate secrets (recommended order)

1. Generate new DB credentials (username/password) from your DB provider.
2. Update deployment environment variables (CI/CD / hosting dashboard) immediately with new `DATABASE_URL`.
3. Generate new JWT secrets:
   - `JWT_SECRET`: use a secure random 64+ character string
   - `JWT_REFRESH_SECRET`: another secure random 64+ char string
   Example (Linux/macOS):

```bash
# generate 48-byte base64
openssl rand -base64 48
```

4. Update deployment environment variables with new JWT secrets.
5. Invalidate existing refresh tokens in the database (force logout):

```sql
-- PostgreSQL example (run in your DB admin console):
UPDATE "User" SET "refreshToken" = NULL;
```

6. Re-deploy application.

## 2) Remove secrets from git history

Choose one of the approaches below. Back up your repo first.

### Using BFG Repo-Cleaner (fast)

```bash
# install BFG (https://rtyley.github.io/bfg-repo-cleaner/)
# remove file named backend/.env from all history
bfg --delete-files .env
# or to remove any file matching pattern
bfg --delete-files backend/.env

# then follow up:
git reflog expire --expire=now --all
git gc --prune=now --aggressive
# force-push cleaned branches
git push --all --force
git push --tags --force
```

### Using git filter-repo (recommended modern tool)

```bash
# install git-filter-repo
# Example: remove backend/.env
git filter-repo --path backend/.env --invert-paths
# Follow up with garbage collection and force-push
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --all --force
git push --tags --force
```

### Windows PowerShell (example)

Use `git-filter-repo` or BFG on Windows via WSL or Git Bash.

## 3) Add `.env` to `.gitignore` (already present in backend/.gitignore)

Ensure no other copies of `.env` or secrets exist in repo. Search with:

```bash
grep -R "JWT_SECRET\|DATABASE_URL\|AWS_SECRET" -n
```

## 4) Post-rotation checks

- Verify the app starts with new env values in staging.
- Confirm old tokens no longer work.
- Update any third-party integrations using the rotated credentials.

If you want, I can prepare a PowerShell script to run the filter-repo or BFG steps interactively — tell me which tool you prefer and whether you have backups and CI permission to force-push.