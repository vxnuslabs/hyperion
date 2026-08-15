# Privacy

Hyperion is architected under the principle of client-side isolation.

## What is Local
- OpenRouter API Keys.
- Active transcription states (chat logs).
- Local system prompt presets (`localStorage`).
- *Note: While your browser will always carry inherent risks when holding credentials in memory, we strongly recommend cloning the repository and running Hyperion locally so you have full control over the deployment rather than relying on the publicly hosted version.*

## What is External
- API authentication payloads.
- Your query text.

When you send a prompt, Hyperion packages your message and routes it to OpenRouter's servers. Third-party providers may retain, train on, or evaluate this data depending on OpenRouter's current policies. Hyperion has zero control over external retention. 

For full legal terms, review `/privacy` and `/terms` within the application interface.
