# Configuration

Hyperion does NOT use a `.env` file to configure its connection to OpenRouter.

Because Hyperion is a strictly client-side local-first interface, injecting API credentials into `.env` would expose them maliciously or compromise the "Bring Your Own Key" (BYOK) architecture.

## Internal Configuration
- **Next.js:** configured via `next.config.ts`.
- **Tailwind CSS:** styles configured heavily via native CSS (`globals.css`) in conjunction with Tailwind v4 standard configuration.
- **TypeScript:** configured via `tsconfig.json`.

All configurations prioritize minimal dependencies and rapid compilation.
