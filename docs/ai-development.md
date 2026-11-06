# AI-assisted development and prompt engineering

## Working model

The site was built through a human-directed, AI-assisted workflow:

1. **Define the intent:** Describe the audience, atmosphere, content and user experience.
2. **Constrain the change:** Specify exact files or pages, existing functionality to preserve, and what not to invent.
3. **Ask for implementation:** Have Codex work in a feature branch and describe its changes.
4. **Review:** Compare the PR diff and the browser preview against the request.
5. **Iterate:** Identify a specific mismatch and request a focused correction to the same PR.
6. **Publish:** Merge approved work to `main`, let GitHub Pages deploy, and pull `main` locally.

## Examples grounded in actual iterations

**Preserving existing behavior:** The Listening Room work specified that original playlist order, official Apple Music embed permissions, no-autoplay behavior, native scrolling, keyboard controls and reduced-motion support should remain intact while the record sleeves changed.

**Turning visual feedback into requirements:** The homepage redesign went through a concrete refinement: restore a prominent brass “ENTER THE LISTENING ROOM” button, then replace mismatched charcoal/cream section backgrounds with a single forest-green surface (`#123C36`) while retaining cream typography and original imagery.

**Avoiding unsupported content:** Gallery and On Air were deliberately labeled as forthcoming. The prompts did not authorize invented photographs, radio episodes or programming schedules.

**Testing boundaries:** Requests included checks and regression preservation, but an automated test passing does not establish that the design looks right in Safari or is fully accessible.

## Example prompt pattern (reconstructed, not verbatim)

> Work on a new feature branch and open a PR; do not merge. Update only the homepage. Use the existing forest-green, cream and brass palette. Preserve the original portrait, shared navigation, existing routes and accessibility features. Make the homepage one uninterrupted forest-green surface, restore the brass Listening Room CTA, and keep the subtle one-time reveal without scroll hijacking. Report the files changed, tests run, and any browser-verification limitations.

The example above is a **reconstruction of requirements reflected in PR #9**, not an archived original Codex prompt. The exact original prompt transcripts have not been independently recovered.

## How to describe the work professionally

“I led the design and requirements for a published frontend website and used Codex as a coding collaborator. I iterated on prompts, reviewed pull-request diffs, tested the experience in Safari, and managed changes through GitHub branches and merges. I can explain the HTML/CSS/JavaScript architecture, the implementation tradeoffs and what still needs testing.”

## Prompt and change log template

For each new feature, record:

- **Issue / PR:**
- **User problem and acceptance criteria:**
- **Exact prompt used (paste verbatim):**
- **Constraints and protected behavior:**
- **Files and functions changed:**
- **Automated checks and manual tests:**
- **Feedback and follow-up prompts:**
- **Final outcome and lessons learned:**

Do not publish private credentials, sensitive information or copyrighted material from others in prompts or logs.
