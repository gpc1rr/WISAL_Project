# WISAL Phase 2 — PHP session authentication

## Included
- `GET /api/auth/csrf` session CSRF token.
- `POST /api/auth/register/beneficiary` creates `users` record.
- `POST /api/auth/register/provider` creates `users` + `providers` atomically.
- `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`.
- Server-side password hashing / verification, phone uniqueness, prepared PDO statements, session renewal, role returned from database.
- React login / registration integrated with API when `VITE_AUTH_MODE=real` (default). Optional `VITE_AUTH_MODE=demo` keeps prior UI demonstration flows.

## Limitations — do not present as complete full-stack website
- Only authentication uses MariaDB. Services, bookings, ratings and dashboards still use the existing mock repositories; they are NOT attached to SQL.
- Existing mock dashboards expect mock IDs; newly registered SQL users may see empty or demo content. Never interpret this as database-owned records.
- The SQL schema does not store beneficiary age, nationality, language or provider bio. These fields remain visible in the UI but are not persisted in SQL.
- Profile editing is intentionally blocked in real auth mode until secure profile endpoints are developed.
- This phase does not include rate limiting, password reset, email/SMS verification or production deployment hardening.
- For production: HTTPS, dedicated DB account, secure cookie/session store, CORS whitelist, login rate limiting, server-side authorization for every future endpoint.

## Setup
1. Copy `backend/config/.env.example` to `backend/config/.env` and set local DB credentials (do not commit).
2. Start PHP backend: `C:\xampp\php\php.exe -S localhost:8000 -t backend/public backend/router.php`.
3. Frontend: copy `.env.example` to `.env.local`, then `npm install` and `npm run dev`.
4. Use `GET /api/health/db` to verify connection, then register real account through the UI.
5. When switching modes, sign out and restart Vite; do not mix demo data with real-user flows.

## API examples
`POST /api/auth/register/beneficiary`: `{ "fullName":"Test User", "phone":"0501231234", "password":"StrongPass123" }`
`POST /api/auth/register/provider`: `{ "fullName":"Test Provider", "phone":"0501231235", "password":"StrongPass123", "age":30, "serviceType":"مرافقة", "experienceYears":3, "languages":["العربية"] }`
`POST /api/auth/login`: `{ "phone":"0501231234", "password":"StrongPass123" }`
All POST requests must first request `/api/auth/csrf` and send `X-CSRF-Token`, using cookies/credentials on both requests.
