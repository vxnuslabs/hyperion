# Conversation Editing

Hyperion tracks messages as an in-memory linear array. Advanced timeline editing allows deep manipulation of this history.

## Retry User Prompts
Submits a truncated request spanning `[0...index]` inclusive, dropping prior faulty outputs and securing a new response.

## Regenerate Assistant Responses
Drops the specific response at `[index]` and refires the prompt context (`[0...index-1]`), prompting the model to try again.

## Branch Editing
When modifying a user prompt located deep within the stack:
1. The user alters prompt `B`.
2. A confirmation modal verifies intent.
3. If confirmed, Hyperion slices the array to remove all subsequent nodes `C, D, E...`.
4. It attaches `B'` and generates a fresh response `C'`.

The old timeline `C, D` is permanently discarded. Hyperion does not feature version control or branch trees.
