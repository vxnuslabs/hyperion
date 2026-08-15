# Architecture

Hyperion is a Next.js (App Router) client-side application designed exclusively as an interface layer between the user and OpenRouter.

## Client/Server Boundary (Dual-Mode Architecture)
Hyperion operates in two distinct modes depending on the deployment environment:
1. **Hosted / Direct Mode**: When deployed without a backend or `.env` configuration, Hyperion acts as a pure client-side application. The user provides the API key via the UI, it resides in memory, and the client communicates directly with OpenRouter.
2. **Local Proxy Mode**: For users self-hosting locally, Hyperion can utilize a Next.js server-side action to read an `OPENROUTER_API_KEY` from a `.env` file. In this mode, the client dynamically routes `fetch` calls to local API endpoints (`/api/chat` and `/api/models`), ensuring the API key never enters the browser's memory.

## State Management
Global state is handled via React Context in `lib/store.tsx`.
- **Volatile State:** `messages`, `apiKey`, and `systemPrompt` are strictly runtime components. The `useLocalProxy` state manages the dynamic routing mode.
- **Persistent State:** `presets` (system prompt snapshots) are synchronized with `localStorage`.

## OpenRouter Integration
Hyperion fetches models dynamically. In Direct Mode, it connects to `https://openrouter.ai/api/v1/models` and manages interactions via `https://openrouter.ai/api/v1/chat/completions`. In Local Proxy Mode, it hits `/api/models` and `/api/chat`.

## Streaming & Abort Mechanics
Generation streams via Server-Sent Events (SSE). 
An `AbortController` ensures that halting a generation or starting a new branch cleanly terminates the previous HTTPS connection, explicitly preventing race conditions where stale chunks append to newer timeline states.
