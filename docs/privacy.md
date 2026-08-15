# Privacy

Hyperion is architected under the principle of client-side isolation.

## What is Local
- OpenRouter API Keys.
- Active transcription states (chat logs).
- Local system prompt presets (`localStorage`).
- *Note: For maximum privacy isolation, we recommend cloning the repository and running Hyperion locally instead of using the hosted version.*

## What is External
- API authentication payloads.
- Your query text.

When you send a prompt, Hyperion packages your message and routes it to OpenRouter's servers. Third-party providers may retain, train on, or evaluate this data depending on OpenRouter's current policies. Hyperion has zero control over external retention. 

For full legal terms, review `/privacy` and `/terms` within the application interface.
