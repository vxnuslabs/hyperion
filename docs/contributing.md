# Contributing

Contributions to Hyperion are welcome, provided they align with the strict design architecture.

## Setup
1. Fork and clone the repository.
2. `npm install`
3. Create a feature branch.
4. `npm run dev`

## Contribution Rules
- **Do not add databases.** The chat must remain purely in volatile memory.
- **Do not introduce component frameworks.** Do not add `shadcn/ui`, `Headless UI`, or thick UI dependency layers. Use native CSS and Tailwind.
- **Do not compromise the BYOK architecture.** Do not build persistent key stores.
- **Maintain styling.** Keep the interface dark, dossier-like, minimalist, and deeply technical. No gradients or soft shadows.

After modifying code, verify locally:
```bash
npm run lint
npm run build
```
