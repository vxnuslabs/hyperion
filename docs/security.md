# Security

> Hyperion is not a security-focused AI platform. It is a local-first client interface.

Hyperion encrypts data exclusively over the standard HTTPS layer during transmission to the external API.

## API Key Security
- Your API key relies entirely on browser tab isolation. 
- It is never stored on disk.
- If your device is compromised, your active session variables could theoretically be accessed.
- **In the hosted version, your browser holds the API key in memory, which carries inherent risks during the session. We strongly recommend cloning the repository and running Hyperion locally. The local version includes an option to use a `.env` file (`OPENROUTER_API_KEY`) which securely proxies requests so the key never touches your browser memory.**

## User Responsibility
Do not paste highly sensitive or classified data into Hyperion assuming it acts as an encrypted local vault. The moment you press enter, data traverses the internet to third parties.

**Always verify the retention policy of your chosen OpenRouter model.**
