# OpenRouter Integration

Hyperion operates as a frontend for the [OpenRouter API](https://openrouter.ai).

## Model Discovery
Models are fetched natively using an unauthenticated `GET` request to `https://openrouter.ai/api/v1/models`. The data is parsed to populate a native HTML5 `<datalist>` selector.

## Chat Completions
Prompts are dispatched to `https://openrouter.ai/api/v1/chat/completions` alongside the dynamically generated `Authorization: Bearer <API_KEY>` header. 

## Streaming
Hyperion sets `stream: true` in the request body. Incoming byte buffers are decoded, fragmented JSON lines are temporarily buffered, and safely parsed into React state updates to render real-time text output without blocking the UI thread.
