# GitHub Copilot Instruction: Enforce Cursor Rule

Purpose
- Ensure Copilot-based agents and assistants follow a consistent "cursor rule" and editing behavior when making changes to the repository.

Rules (apply to any AI writing or editing code in this repo)

1. Cursor-first edits
- Always favor minimal, focused edits at or immediately around the user's current cursor location. If the requested change affects other files, explicitly state why and list the target files in a one-line preamble.

2. Preamble before modifications
- Before any file-modifying tool call (patch/create/delete), send a concise 1-sentence preamble describing what will be changed and why. Example: "Patching header meta: add Pinterest verification meta tag to `frontend/index.html`."

3. Use apply_patch (or repo's editor tool)
- Perform edits using the repository's approved patch tool (for example `apply_patch`) and include a short explanation with the patch tool call. Keep patches minimal and scoped.

4. Explain and summarize
- After applying changes, produce a short progress update listing the edited files and the next recommended steps (commit, run tests, or deploy). Keep this to 1-3 lines.

5. Do not change unrelated code
- Avoid reformatting or touching unrelated areas. If a change requires broader refactors, explain the reasons and get explicit user approval first.

6. Testing and verification
- If the change affects runtime behavior or build artifacts, run the relevant tests or build steps when possible and include results or errors in the summary.

7. Provide alternatives
- When a verification method has multiple valid options (meta tag, html file, TXT record), implement only the option requested by the user and offer the alternatives in one line.

8. Permission and committing
- Do not commit or push changes without explicit user confirmation. Offer a one-line commit suggestion the user can approve (commit message and files changed).

Examples
- Preamble: "Adding domain verification meta to `frontend/index.html` (Pinterest)."
- Patch explanation: "Add Pinterest `p:domain_verify` meta to head to verify domain with Pinterest."
- Summary: "Edited `frontend/index.html` — added Pinterest meta; next: commit or add TXT verification."

Notes
- These instructions are intended to be followed by Copilot assistants and other automated agents working in this repository. They are not a replacement for explicit user instructions; when in doubt, ask the user.

If you'd like, I can also copy this into a `.github/` or `docs/` location, or create a pre-commit hook that prints the rule when edits are staged. Which would you prefer?