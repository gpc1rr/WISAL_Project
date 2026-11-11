# WISAL Backend — Phase 1 (PHP 8 / PDO / MariaDB)

Phase 1 adds a separate read-only health API and database-connection check. The React frontend is unchanged and still uses demo repositories. No user credentials, application data, or migrations have been added.

## XAMPP setup

1. Put the whole `WISAL_Frontend_Professional` folder under `C:\xampp\htdocs\`.
2. Start **Apache** and **MySQL** in XAMPP.
3. In `http://localhost/phpmyadmin/`, create database `wisal_db` with `utf8mb4_unicode_ci` collation (if absent). Import `backend/database/wisal_db.sql` **only into a fresh/empty database**. Back up any existing database first.
4. Copy `backend/config/.env.example` to `backend/config/.env`; adjust host, port, user and password for your local MariaDB. Never commit `.env`.
5. Enable `pdo_mysql` in the PHP used by Apache.
6. For convenient routing, create an Apache alias to `backend/public`, or use the direct PHP development server below.

## Simplest local run (separate terminals)

From the project root:

```powershell
cd C:\xampp\htdocs\WISAL_Frontend_Professional
C:\xampp\php\php.exe -S 127.0.0.1:8000 -t backend/public backend/router.php
```

And in another terminal for React:

```powershell
npm.cmd install
npm.cmd run dev
```

Verify:

- `http://127.0.0.1:8000/api/health` returns `status: ok`.
- `http://127.0.0.1:8000/api/health/db` returns `database: ready` when the DB is imported and configured.
- `http://localhost:5173/` keeps running the unchanged frontend.

If using the PHP CLI dev server, ensure your php.exe has `pdo_mysql` enabled and MySQL is running in XAMPP.

## Security notes

Use only locally in Phase 1. The health/database endpoint reports availability only, not secrets. No real login API has been implemented. Do not expose the app publicly without adding authentication, authorization, HTTPS, rate limits and disabling or protecting internal health checks.

## Phase 1 acceptance

- PHP syntax check passes on source files.
- Health endpoint returns 200 on a running server.
- Database endpoint returns 200 only with connection and all five required tables.
- React sources remain unchanged.
