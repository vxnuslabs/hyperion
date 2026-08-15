# HYPERION

A local-first AI chat interface for OpenRouter.

Hyperion is a client-side interface for interacting with models available through OpenRouter. Bring your own OpenRouter API key, select a model, and start a conversation without creating a Hyperion account or relying on a Hyperion-hosted chat database.

**Hyperion by VXNUS Creative Technology Studio**  
[vxnus.xyz](https://vxnus.xyz) | **[Hosted Version](https://hyperion.vxnus.xyz)**

---

## Features

- **BYOK (Bring Your Own Key):** Connect directly to OpenRouter using your own API key.
- **Runtime-only API key handling:** Keys are held in volatile memory and never persisted locally.
- **Dynamic model discovery:** Instantly fetch and search OpenRouter's current model catalog.
- **Streaming responses:** Real-time generation rendering with native Server-Sent Events (SSE) buffering.
- **System prompts:** Apply custom instructions for the current session or save local presets.
- **Fresh sessions:** Clean session isolation. No cross-session memory pollution.
- **No server-side database:** Hyperion does not persist your chat history.
- **Advanced conversation editing:**
  - Edit previous user turns (creates a branch and truncates the tail).
  - Retry user requests.
  - Regenerate AI responses.
- **Destructive confirmation:** Protects against accidental truncation when branching from an earlier turn.
- **JSON conversation export:** Download your active session transcript locally.
- **Robust error handling:** Gracefully manages API rate limits, parsing faults, and network interruptions.
- **Minimalist aesthetic:** A restrained, dark, technical, dossier-inspired interface.

---

## Architecture

Hyperion is explicitly designed as a **local-first client interface**. 

It is NOT a security product, an encrypted messaging locker, an anonymous AI service, or a replacement for OpenRouter. It operates entirely as a browser-side application orchestrating requests to an external API.

```text
┌───────────────────────────────┐
│           Browser             │
│                               │
│  Hyperion UI                  │
│  React state                  │
│  In-memory conversation       │
│  Runtime API key              │
│  Local preset storage         │
│                               │
└───────────────┬───────────────┘
                │
                │ HTTPS
                ▼
┌───────────────────────────────┐
│        OpenRouter API         │
│                               │
│  Model discovery              │
│  Chat completions             │
│  Streaming                    │
└───────────────┬───────────────┘
                │
                ▼
       Selected model/provider
```

*(Note: OpenRouter and external model providers operate under their own independent terms, privacy policies, and retention schedules outside of Hyperion's scope.)*

---

## Requirements

- [Node.js](https://nodejs.org) (v18+)
- npm
- A modern web browser
- An [OpenRouter account and API key](https://openrouter.ai)

---

## Installation

To clone and run Hyperion locally on your machine:

```bash
git clone https://github.com/vxnuslabs/hyperion.git
cd hyperion
npm install
npm run dev
```

The interface will initialize at `http://localhost:3000`.

---

## Quick Start

### 1. Launch Hyperion
Start the application using `npm run dev` and open the local URL in your browser.

### 2. Connect to OpenRouter
Obtain an API key from [openrouter.ai/keys](https://openrouter.ai/keys).

### 3. Initialize the Console
Paste the key into the Hyperion authentication screen. The key is written strictly to runtime memory—it is never written to `localStorage` or transmitted to a backend proxy.

### 4. Select a Model
Use the top navigation to search and select a model. Hyperion dynamically retrieves the current catalog from OpenRouter.

### 5. Start a Session
Enter your prompt. Hyperion will establish a streaming connection to OpenRouter.

---

## API Key Handling

Hyperion operates on a strictly BYOK (Bring Your Own Key) architecture. 

- Your API key remains exclusively in React state.
- It is never written to `localStorage`, `sessionStorage`, `IndexedDB`, or cookies.
- It is never exposed in the URL.
- Hyperion does not run a server-side authentication proxy.
- **Reloading the page instantly destroys the API key.**

> **Security Recommendation**: While Hyperion operates purely on the client-side, the browser will always carry inherent risks when holding credentials in memory. We strongly recommend **cloning the repository and running it locally** so you have full control over the deployment rather than relying on the publicly hosted version.

---

## Storage & Privacy

Hyperion enforces local-first constraints. 

**Hyperion does NOT persist:**
- Chat history
- API keys
- Cross-session memory

**Hyperion MAY persist:**
- System prompt presets (stored exclusively in browser `localStorage`).

Because Hyperion has no application database, transcripts are ephemeral. If you need to retain a conversation, use the **Export** feature before closing the tab.

For full details, read the [Privacy Policy](./app/privacy/page.tsx).

---

## Conversations & Editing

Hyperion treats the current session as a linear, in-memory sequence. Advanced editing tools allow you to manipulate this timeline.

### Edit & Branch
You can edit any previous user message. If the edited message has subsequent conversation history, modifying it operates as a **branch**: everything after the selected turn is discarded, and a new assistant response is generated from that point forward. Hyperion will explicitly warn you with a confirmation modal before dropping a conversation tail.

### Retry
You can resubmit a user message to receive a new response without duplicating the prompt.

### Regenerate
You can immediately discard an assistant's response and request a new one from the same context.

---

## System Prompts

System prompts define the core behavior and identity of the AI model.
- **Active Prompt:** Applies only to the current session.
- **Presets:** You can save an active prompt as a preset (written to `localStorage`). 
- **Important:** Activating a preset configures the *current* session. Starting a New Chat does not automatically inherit the last used preset.

---

## Exporting Conversations

Click **Export** to securely download the active session to your machine. The export occurs entirely within the browser. No data is uploaded to a remote server. 

Example export format:
```json
{
  "version": 1,
  "exportedAt": "2026-08-15T00:00:00.000Z",
  "model": "anthropic/claude-3-5-sonnet",
  "systemPrompt": "You are a helpful assistant.",
  "messages": [...]
}
```
*(The OpenRouter API key is strictly excluded from all exports.)*

---

## Self-Hosting

Hyperion is open-source. Because it relies purely on client-side state for conversation handling, you can easily self-host the interface.

```bash
npm run build
npm run start
```

Self-hosting the Hyperion UI does not mean you are locally hosting AI model weights. Your browser will still securely transmit queries to OpenRouter's external API.

---

## Documentation

Comprehensive architecture, deployment, and contribution documentation can be found in the `docs/` directory:

- [Architecture](docs/architecture.md)
- [Getting Started](docs/getting-started.md)
- [Configuration](docs/configuration.md)
- [OpenRouter Integration](docs/openrouter.md)
- [Storage & Data](docs/storage-and-data.md)
- [Sessions](docs/sessions.md)
- [Conversation Editing](docs/conversation-editing.md)
- [System Prompts](docs/system-prompts.md)
- [Export Format](docs/export-format.md)
- [Error Handling](docs/error-handling.md)
- [Privacy](docs/privacy.md)
- [Security Considerations](docs/security.md)
- [Deployment](docs/deployment.md)
- [Development](docs/development.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Contributing](docs/contributing.md)

---

## License

Hyperion is licensed under the [MIT License](LICENSE).

Copyright © 2026 VXNUS Creative Technology Studio.
