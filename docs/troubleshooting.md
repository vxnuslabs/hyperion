# Troubleshooting

## API Key Rejected
Ensure your OpenRouter API key (`sk-or-v1-...`) has sufficient permissions and active credits. Confirm network access to `openrouter.ai`.

## Models Refuse to Load
Check your browser developer console for CORS or network disruptions preventing the fetching of the OpenRouter model catalog. 

## Missing Presets
Hyperion stores your customized system prompts in `localStorage`. If you clear your browser cookies, site data, or utilize incognito tabs, these presets will be permanently erased.

## Missing Conversations
By design, refreshing your tab or closing the window completely deletes the running context. Export conversations locally before refreshing if you intend to preserve them.
