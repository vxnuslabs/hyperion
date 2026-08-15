# Storage & Data

Hyperion possesses no database. Its storage is strictly delineated by persistence requirements.

| Data          | Location            | Persistent? | Purpose                       |
| ------------- | ------------------- | ----------- | ----------------------------- |
| API key       | React runtime state | No          | OpenRouter authentication     |
| Chat messages | React runtime state | No          | Current conversation          |
| System prompt | React runtime state | No          | Current session configuration |
| Presets       | localStorage        | Yes         | User-saved system prompts     |

To erase presets, users may clear their local browser site data.
