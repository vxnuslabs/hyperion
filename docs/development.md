# Development

Hyperion enforces strict modular boundaries.

## Architecture
- **State:** Handled synchronously in `lib/store.tsx` using Zustand.
- **Views:** Driven by Next.js App Router (`app/`).
- **Styling:** Bespoke monochromatic palette enforced natively in `globals.css` with minimal utility usage via Tailwind CSS v4. No `shadcn/ui` frameworks.

## Guidelines
- Do not introduce server-side logic (`"use server"`).
- Maintain the strict zero-database, volatile-memory paradigm.
- All errors must map to clean, readable JSX elements rather than printing trace logs.
