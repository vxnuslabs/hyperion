# Error Handling

Hyperion maps common HTTPS REST failures to user-facing diagnostic UI blocks.

## Detected Anomalies
- **401 Unauthorized:** OpenRouter rejected the local API key.
- **402 Payment Required:** The account lacks sufficient credits.
- **429 Too Many Requests:** Global or user rate limits encountered.
- **Streaming Errors:** The network stream broke down mid-generation. Hyperion safely buffers the JSON to prevent `JSON.parse` crashes and offers a localized **Retry Response** action for interrupted outputs.

## Recovery
Failed requests do not collapse the timeline. The chat array preserves all prior validated context, permitting immediate recovery operations via contextual Retry buttons.
