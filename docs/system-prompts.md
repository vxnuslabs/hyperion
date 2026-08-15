# System Prompts

System prompts are injected as the first array node (`role: "system"`) sent to OpenRouter.

## Active Session
An active system prompt uniquely applies to the running chat sequence. Initializing a new chat clears it automatically.

## Local Presets
Users can save prompts as named presets in their local browser storage (`localStorage`). 

**Important:** Saved presets do not automatically load. A user must actively retrieve and load a preset into their session.
