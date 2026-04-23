# Dashboard UX Phases

## Phase 1: Foundation polish

Status: Implemented.

- Preserved the Vitality Core design DNA: light surfaces, lime accents, rounded cards, and soft tonal depth.
- Improved dashboard card context with clearer labels, goal progress, trend hints, and accessible controls.
- Added global focus-visible states and reduced-motion support.

## Phase 2: Layout alignment

Status: Implemented.

- Aligned sticky header actions to the same `max-w-7xl` dashboard container.
- Moved search into the dashboard intro area so it belongs to the current page workflow.
- Improved intro controls so search and date sit together on larger screens and stack cleanly on mobile.
- Added a labeled Quick Actions section for better scanning.
- Improved mobile navigation button accessibility.

## Phase 3: Interaction states

Status: Implemented.

- Added clearer action affordances to membership, revenue, stats, target, and quick-action cards.
- Added a keyboard command hint to dashboard search.
- Replaced the check-in select with a pill filter group that matches the current design DNA.
- Added target status labels and hover/active states for interactive cards.
- Preserved the existing rounded, tonal, lime-accented visual system.

## Phase 4: Data clarity

Status: Implemented.

- Added SQLite-backed CRUD records for Members, Staff, Equipment, Classes, Financials, and Settings.
- Added searchable production workspaces with record tables, metrics, create/edit forms, delete actions, loading states, and empty states.
- Wired dashboard quick actions to the correct module workflows.
- Preserved the current Vitality Core visual DNA across CRUD screens.

## Phase 5: Production readiness

Status: Implemented locally.

- Added a local SQLite backend using Node's native `node:sqlite` module.
- Added REST endpoints for module records: list, create, update, and delete.
- Replaced frontend localStorage persistence with API-backed CRUD.
- Added backend-aware UX: loading skeletons, sync action, save feedback, safer delete confirmation, and disabled saving states.
- Cleaned CRUD pages by reducing instructional copy and keeping actions visually direct.
- Added backend validation for required fields and duplicate names.
- Added SQLite audit logs for create, update, and delete actions with compact activity UI.
- Added local ShadCN-style UI primitives using Radix Dialog, AlertDialog, and Slot.
- Moved CRUD forms into accessible Radix dialogs and delete confirmation into Radix alert dialogs.
- Flattened CRUD module pages into one cleaner workspace with inline metric chips instead of stacked side cards.
- Added mobile-friendly record cards below the desktop table breakpoint.
- Added form-level error feedback so validation failures keep dialogs open.
- Added clearer backend offline messaging and scrollable dialogs for small screens.
- Added a clean frontend login page and local session gate.
- Removed duplicate page controls and noisy audit chips from CRUD pages.
- Reworked Settings into a preference-style workspace instead of a table CRUD page.
- Reworked Logout into a confirmation dialog instead of a standalone page.
- Added `npm run server` for the SQLite API and `npm run dev:full` for frontend plus backend together.
- Next step: backend authentication, dashboard metrics, command search, soft delete recovery, and tests.

## Phase 6: Backend auth and permissions

Status: Next.

- Add `users` table with seeded manager account.
- Add password hashing with `crypto.scrypt` or `bcrypt`.
- Add login/logout API endpoints.
- Replace frontend-local session with backend-issued session token.
- Add role permissions for manager, staff, and front desk actions.
- Log login, logout, failed login, and permission-denied events.

## Phase 7: Connected dashboard and command search

Status: Planned.

- Replace static dashboard cards with SQLite-backed metrics.
- Connect membership totals, revenue totals, staff coverage, equipment attention, class capacity, and financial status to real records.
- Add cross-module command search for members, staff, equipment, classes, financials, and settings.
- Add keyboard shortcut support after search is functional.
- Keep the search UI hidden until it is wired.

## Production Audit

Status: Open.

- P0 Security: replace local login with SQLite-backed auth, hashed passwords, session tokens, route protection, and roles.
- P0 Data safety: add soft delete/recovery before destructive deletes are considered production-safe.
- P1 Dashboard data: connect dashboard summary cards to SQLite metrics instead of static values.
- P1 Search: implement real cross-module command/search flow before showing global search again.
- P1 Data integrity: add stronger domain validation and database-level unique indexes.
- P2 Operations: extend audit logs to login, logout, failed validation, permission events, and soft-delete recovery.
- P2 Testing: add API tests for every module and UI tests for CRUD forms, settings, navigation, login, and empty states.
- P2 Deployment: add production server script, environment config, backup strategy, and database migration flow.
- P2 Dependency hygiene: resolve the Vite/esbuild development-server advisory before deployment; the automated fix requires a breaking Vite upgrade.

## UX Audit

Status: Active.

- Fixed: CRUD pages had too many cards and duplicate form entry points.
- Fixed: CRUD records were table-only and weak on mobile.
- Fixed: form validation errors could close or feel disconnected from the dialog.
- Fixed: global search looked usable but was not wired.
- Fixed: Settings table layout was not user-friendly for preferences.
- Fixed: Logout used a different page pattern than other actions.
- Fixed: duplicate module titles, duplicate search, and visible audit chips created visual noise.
- Open: dashboard cards are still static and should use SQLite-backed metrics.
- Open: login/logout is frontend-local until backend auth exists.
- Open: forms need stronger field-specific validation and formatting.
