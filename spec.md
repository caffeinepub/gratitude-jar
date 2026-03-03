# Gratitude Jar

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Gratitude note input field with submit button
- localStorage persistence for all notes
- Jar icon with note count badge
- "Pull Random Gratitude" button that displays a random saved note
- Daily reminder toggle (visual only, no real notifications)
- Mobile-first, calm pastel design

### Modify
N/A

### Remove
N/A

## Implementation Plan
- Single-page React app with no backend
- State managed via React hooks (`useState`, `useEffect`)
- Notes stored and retrieved from `localStorage`
- Jar icon (SVG or emoji-based) with a count overlay
- Add note form: textarea + submit button
- Note list showing all entries
- "Pull Random Gratitude" button: picks a random note from the array and displays it in a card/modal
- Daily reminder toggle: a styled switch that sets a flag in localStorage (visual feedback only)
- Calm pastel color palette with minimal, clean layout
