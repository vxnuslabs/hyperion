# Architecture

Hyperion is a Next.js (App Router) client-side application designed exclusively as an interface layer between the user and OpenRouter.

## Client/Server Boundary
Hyperion possesses no server-side APIs, database schemas, or backend proxy endpoints. All code executes locally in the browser (`"use client"`). 

## State Management
Global state is handled via React Context (Zustand) in `lib/store.tsx`.
- **Volatile State:** `messages`, `apiKey`, and `systemPrompt` are strictly runtime components.
- **Persistent State:** `presets` (system prompt snapshots) are synchronized with `localStorage`.

## OpenRouter Integration
Hyperion fetches models dynamically from `https://openrouter.ai/api/v1/models` and manages interactions via `https://openrouter.ai/api/v1/chat/completions`.

## Streaming & Abort Mechanics
Generation streams via Server-Sent Events (SSE). 
An `AbortController` ensures that halting a generation or starting a new branch cleanly terminates the previous HTTPS connection, explicitly preventing race conditions where stale chunks append to newer timeline states.
