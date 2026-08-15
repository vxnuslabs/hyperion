# Security

> Hyperion is not a security-focused AI platform. It is a local-first client interface.

Hyperion encrypts data exclusively over the standard HTTPS layer during transmission to the external API.

## API Key Security
- Your API key relies entirely on browser tab isolation. 
- It is never stored on disk.
- If your device is compromised, your active session variables could theoretically be accessed.
- **For maximum isolation and security, we strongly recommend cloning the repository and running Hyperion locally instead of using any publicly hosted version.**

## User Responsibility
Do not paste highly sensitive or classified data into Hyperion assuming it acts as an encrypted local vault. The moment you press enter, data traverses the internet to third parties.

**Always verify the retention policy of your chosen OpenRouter model.**
