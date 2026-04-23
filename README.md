# Stamina OS - Gym Management System

Local gym management dashboard for Titan Gym built with React, Vite, Tailwind CSS, Radix/ShadCN-style UI primitives, and a local SQLite backend.

## Setup

```bash
npm install
npm run dev:full
```

The frontend runs through Vite and proxies API calls to the local SQLite server.

## Login

Default backend login:

- Email: `manager@titangym.local`
- Password: `manager`

Authentication uses the local SQLite backend, bcrypt password hashing, and a JWT httpOnly cookie.

## Scripts

```bash
npm run dev
npm run server
npm run dev:full
npm run build
```

## Local Data

SQLite data is stored at:

```text
data/gym-system.sqlite
```

Database files are ignored by git.

## Production Roadmap

See `UX_PHASES.md` for the v2 roadmap, production audit, and next implementation order.
