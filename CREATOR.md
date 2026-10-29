# Creator workflow

Mechanicals & Blueprints keeps the model-first authoring approach and the useful SVG craft tools from Anatomy, while making graph/data-structure explainers the default use case.

## Agent-assisted authoring

Install this repository's `SKILL.md` as an Agent Skill, then ask the agent to build a figure by topic, for example: “Create an interactive Dijkstra explainer using a six-vertex weighted graph. Show each relaxation, distance table, and final path.” The skill asks the agent to define and validate the graph, compute steps from that model, create a responsive figure, and verify each readout.

For package figures, use `packages/graph-studio/models.js` and the `<mb-figure>` renderer. The `playground` model offers in-browser node selection, edge creation, removal, and clearing. For a one-off custom figure, use the inherited `kit/iso-kit.mjs` tools to render standalone SVG/HTML; read `references/kit.md`, `references/craft.md`, and `references/motion.md` first.

## Preview and refine

Run `npm run build`, serve the repository root with any static server, and open `creator.html`. Choose a starting model, refine its title/description, and use the playground's controls to edit vertices and edges. Export graph JSON as the source data for the figure implementation. Use `packages/graph-studio/gallery.html` to inspect all ten shipped studies. Move algorithm studies forward/back and reset them; switch the list/matrix view; inspect the live status and model values at each step. Check keyboard operation with Tab, Enter/Space, Left/Right, and Home. Repeat at a narrow viewport and with reduced motion enabled.

## Extend a model

Add graph data and a pure step generator to `packages/graph-studio/models.js`, then add its model identifier and description to the exported registry. Use the shared renderer where possible so focus, theme tokens, layout, and readouts stay consistent. Add an assert-based algorithm check to `model.test.mjs`, document the model, and add it to the gallery.

## Install the skill

From this repository, copy `SKILL.md` and the referenced `references/` directory into your agent's skill location, or install from GitHub after the private repository is created:

```sh
npx skills add mhatreanuj57-alt/mechanicals-and-blueprints --skill mechanicals-and-blueprints
```

Agent-specific paths and invocation depend on the agent. Codex generally uses `.agents/skills/` and `$mechanicals-and-blueprints`; Claude Code uses `.claude/skills/` and `/mechanicals-and-blueprints`.
