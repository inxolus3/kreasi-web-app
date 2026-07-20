# ZAP Scan Instructions

This folder contains helper scripts to run OWASP ZAP scans using Docker.

Baseline scan (UI + basic checks):

```bash
./zap-docker-scan.sh http://localhost:3000 ./zap-output
```

API scan using OpenAPI spec (if available):

```bash
./zap-docker-scan.sh http://localhost:3000 ./zap-output
# then use zap-api-scan.py inside docker to run OpenAPI-based scans
```

Authenticated scans:
- For cookie-based authentication, create a login script in ZAP that posts to `/api/auth/login` and captures the cookie. Use ZAP's context to include authenticated URLs.
- Alternatively, export a session cookie from the browser and configure ZAP to use it for testing.

I can prepare a concrete ZAP Auth script if you provide test credentials (username/password) for a staging account.
