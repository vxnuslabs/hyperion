# Security

> Hyperion is not a security-focused AI platform. It is a local-first client interface.

Hyperion encrypts data exclusively over the standard HTTPS layer during transmission to the external API.

## API Key Security
- Your API key relies entirely on browser tab isolation. 
- It is never stored on disk.
- If your device is compromised, your active session variables could theoretically be accessed.

## User Responsibility
Do not paste highly sensitive or classified data into Hyperion assuming it acts as an encrypted local vault. The moment you press enter, data traverses the internet to third parties.

**Always verify the retention policy of your chosen OpenRouter model.**
