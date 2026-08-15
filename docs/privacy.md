# Privacy

Hyperion is architected under the principle of client-side isolation.

## What is Local
- OpenRouter API Keys.
- Active transcription states (chat logs).
- Local system prompt presets (`localStorage`).
- *Note: In the hosted version, your browser holds credentials in memory during the session. We strongly recommend cloning the repository and running Hyperion locally. The local version includes an option to use a `.env` file (`OPENROUTER_API_KEY`) which securely proxies requests so the key never touches your browser memory.*

## What is External
- API authentication payloads.
- Your query text.

When you send a prompt, Hyperion packages your message and routes it to OpenRouter's servers. Third-party providers may retain, train on, or evaluate this data depending on OpenRouter's current policies. Hyperion has zero control over external retention. 

For full legal terms, review `/privacy` and `/terms` within the application interface.
