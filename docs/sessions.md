# Sessions

A "session" in Hyperion is an abstract concept referencing the active, in-memory transcript of a conversation. It is not a persistent server-side record.

## Lifecycle
- **Initialization:** Occurs when a user successfully inputs their OpenRouter API key.
- **New Chat:** Triggers a manual reset. The `messages` array is cleared, and the active `systemPrompt` is erased, creating an isolated, fresh state.
- **Reloading:** Instantly purges the session. The user must re-authenticate with their API key to start a new session.
