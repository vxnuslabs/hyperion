# Deployment

Deploying the Hyperion interface is straightforward due to its static client-side architecture.

## Build and Start
```bash
npm run build
npm run start
```

## Considerations
Hyperion does not feature `.env` injection for the standard user OpenRouter API key. 

**Do NOT inject your personal key into environment variables.**

Deploying the frontend interface to a Vercel, Netlify, or local Docker instance simply hosts the JavaScript client. Users accessing that deployment must still supply their own independent API keys locally in their browsers.
