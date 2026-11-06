# Development history and decisions

This is a readable summary of the repository's recorded pull-request history, not a verbatim transcript of every prompt or local edit. Dates below refer to November 5–6, 2026 (GitHub timestamps may use UTC). For exact code changes, inspect each PR's **Files changed** tab.

| PR | Change | Engineering or design decision |
|---|---|---|
| [#1](https://github.com/GitWithMani/manis-playground/pull/1) | Homepage HTML and accessibility repairs | Corrected document structure, image attributes, semantic landmarks, contrast and reduced-motion behavior without replacing the original portrait. |
| [#2](https://github.com/GitWithMani/manis-playground/pull/2) | Listening, Gallery and On Air pages | Introduced responsive shared navigation, skip links, active-page indicators and intentionally honest placeholders. |
| [#3](https://github.com/GitWithMani/manis-playground/pull/3) | Typography study | A standalone comparison experiment; **not merged**. It should not be described as part of the published site. |
| [#4](https://github.com/GitWithMani/manis-playground/pull/4) | Room-specific colors | Used CSS variables and body classes to give rooms distinct atmospheres while retaining shared components. |
| [#5](https://github.com/GitWithMani/manis-playground/pull/5) | Homepage flow | Tightened the invitation → portrait → introduction sequence and refined the primary Listening Room link. |
| [#6](https://github.com/GitWithMani/manis-playground/pull/6) | Apple Music playlist carousel | Added one official iframe, three playlist selections, native controls, responsive scrolling, ARIA selection states and no autoplay. |
| [#7](https://github.com/GitWithMani/manis-playground/pull/7) | Compact vinyl carousel | Reduced sleeve size, retained native swipe and keyboard behavior, and refined record visuals. |
| [#8](https://github.com/GitWithMani/manis-playground/pull/8) | Original artwork and portrait | Integrated original images and tactile vinyl behavior; this PR targeted the #7 feature branch before both were merged. |
| [#9](https://github.com/GitWithMani/manis-playground/pull/9) | Editorial homepage redesign | Added homepage-specific CSS/JS, asymmetrical hero, Gallery/On Air teasers, a prominent brass CTA, continuous forest green and subtle one-time scroll reveals. |

## Architecture

- `index.html` — Home and navigation into the rooms
- `listening.html` + `listening.js` — Playlist collection, player selection and carousel behavior
- `gallery.html` — Future gallery
- `radio.html` — Future radio room
- `style.css` — Shared design system and room styling
- `home.css` + `home.js` — Homepage-specific layout and progressive reveal animations
- `images/` — Original photography and playlist art

## Representative engineering choices

**Single embedded player:** Playlist selection updates one Apple Music iframe rather than rendering several competing players. It changes the source and accompanying accessible state without automatically starting playback.

**Progressive enhancement:** Homepage content remains visible even if JavaScript fails. The reveal effect uses IntersectionObserver and the Web Animations API, respects reduced-motion preferences and does not hijack scrolling.

**Scoped CSS:** Homepage rules use a home-page class so visual redesigns do not unintentionally alter other rooms.

**Accessibility:** The project includes semantic main landmarks, descriptive image text, keyboard-capable buttons, focus states and reduced-motion behavior. These choices are documented in PR descriptions; they do not constitute a full accessibility audit.

## Validation and limitations

PR descriptions record source-level HTML/CSS checks, JavaScript syntax and mock-DOM tests for selected features. Some Codex environments could not launch Chromium, so visual verification was performed separately in Safari where possible. Mobile-device, screen-reader and comprehensive browser testing remain future work.

## Suggested next milestones

See [Issues](https://github.com/GitWithMani/manis-playground/issues) for the planned Gallery, On Air, and quality-improvement work. Keep future PRs small and link each change to a documented requirement and verification note.
