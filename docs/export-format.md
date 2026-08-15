# Export Format

Hyperion exports conversations strictly as static, structured JSON files.

## Schema

```json
{
  "version": 1,
  "exportedAt": "2026-08-15T00:00:00.000Z",
  "model": "anthropic/claude-3-5-sonnet",
  "systemPrompt": "You are a helpful assistant.",
  "messages": [
    {
      "role": "user",
      "content": "Explain quantum mechanics."
    },
    {
      "role": "assistant",
      "content": "Quantum mechanics is..."
    }
  ]
}
```

*Note: The format is currently versioned (`1`) and subject to evolution.*
