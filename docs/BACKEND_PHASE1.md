# WISAL — Backend Phase 1 Handoff

- Framework: plain PHP 8 + PDO + MariaDB, no Composer dependency.
- Database: provided schema, unchanged. Five tables: users, providers, services, bookings, ratings.
- The current React repository files still use demo state; they were not modified.
- `GET /api/health` checks the API process.
- `GET /api/health/db` checks actual MariaDB access and that all five tables exist.
- Endpoints for authentication, catalog, bookings and ratings are **not implemented in Phase 1**.
- To minimize risk, keep DB secrets in ignored `backend/config/.env` and do not share it.
- Next phase: agree JSON contracts, password-hashing/login/session strategy, role authorization and schema mismatches before wiring frontend.

See `backend/README.md` for installation and verification commands.
