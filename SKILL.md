---
name: mechanicals-and-blueprints
description: Create polished, interactive technical explainers with graph structures and algorithms as first-class subjects. Build responsive SVG figures whose nodes, edges, progression, and live readouts are driven by the same real model. Use for graph/data-structure diagrams, algorithm walkthroughs, dependency maps, or editable graph studies.
license: MIT
compatibility: Claude Code, Codex, Antigravity, OpenCode, and other agents that support Agent Skills. The inherited creator kit needs Node.js 20.10+; browser checks need Chrome or Chromium.
metadata:
  opencode/slash: "true"
---

# Mechanicals & Blueprints

Make the mechanism legible. Start from the real graph or system, then show its structure and behavior in a figure a reader can inspect and operate. Graphs are first-class: vertices and edges are real entities, algorithms operate on the same model that is rendered, and every live readout is derived from the current state.

This skill adapts the creator workflow and SVG craft kit from [Anatomy](https://github.com/wheresryan22/anatomy), Copyright (c) 2026 Ryan, under MIT. The original license is retained in `LICENSE`; product adaptations and attribution are described in `NOTICE`. Use the shipped examples as source references and preserve their notices when moving code.

## Choose the right representation

- For graphs, draw vertices, edges, direction, weights, and state directly. Place node labels clearly and route edges so crossings are easy to follow.
- For a graph data structure, use a physical metaphor only when it clarifies storage (for example, linked adjacency buckets beside a matrix). Keep the graph itself visible.
- For non-graph systems, use Anatomy’s isometric object craft: a recognizable device whose motion maps to the concept. Do not force a machine metaphor onto an algorithm when a direct graph view is clearer.
- A figure can be a compact SVG/card, a richer SVG with meaningful interaction, or a larger hero. Do not add WebGL or 3D unless it communicates something SVG cannot.

## Workflow

1. **Name the idea and scope.** State the audience, central concept, and smallest useful figure. Build one algorithm or mechanism at a time; avoid expanding into an entire textbook chapter.
2. **Write the source model first.** Define vertices, edges, direction, weights, and initial values as data. Validate referenced endpoints and algorithm preconditions (for example, positive weights for Dijkstra). Keep computation pure where practical.
3. **Define the state transitions.** Specify the queue, stack, distances, indegrees, component groups, accepted edges, or other state that drives the explanation. Compute steps from the graph instead of hand-authoring a second, conflicting readout.
4. **Plan the visual hierarchy.** At rest, show the whole structure. On each step, distinguish current, visited, queued/stacked, selected, and candidate elements with both color and a clear non-color cue. Keep labels and edge weights legible at phone width.
5. **Build the figure.** Use the framework-free custom element in `packages/graph-studio/` for the shipped graph models, or use `kit/iso-kit.mjs` for a standalone SVG/HTML creator output. Precompute static geometry. The upstream kit's `kit/react/` helpers remain available for React figures.
6. **Add interaction with purpose.** Provide previous/next/reset for algorithm steps; direct selection for inspection; editing only when the model calls for it. Pointer interactions must have keyboard equivalents. Keep figures understandable when motion is reduced and without sound.
7. **Keep motion calm.** Use short state transitions or user-advanced steps. Avoid autoplay for algorithm lessons. Respect `prefers-reduced-motion`; stop any optional continuous work when offscreen.
8. **Verify model truth.** Check that every displayed path, distance, order, component, cycle, and tree weight matches the underlying computation. Test empty and boundary states, disconnected vertices, and invalid edits.
9. **Inspect the rendering.** Build the page; capture desktop and narrow layouts; inspect text, contrast, edge crossings, focus rings, selected state, and responsive behavior. For inherited isometric geometry, keep using the kit audit and line-end scripts.

## Interaction and accessibility rules

- Use actual buttons for controls and keyboard-operable graph nodes with accessible names.
- Expose algorithm updates in a concise `aria-live="polite"` status. Do not announce every animation frame.
- Provide visible `:focus-visible` styling and preserve a logical tab order.
- Support Left/Right step navigation, Home reset, and Space to advance when focus is on the figure, while preserving normal input behavior.
- Never use color alone: pair state colors with outlines, labels, patterns, or explicit readouts.
- Use responsive `viewBox` SVG or equivalent; avoid fixed-width canvases that clip on mobile.
- No sound by default. If a future figure needs sound, it must explain a meaningful event, offer an obvious mute control, and wait for explicit user input before starting.

## Package conventions

Use `<mb-figure model="bfs"></mb-figure>` for a shipped graph study. Supported models: `graph-basics`, `representations`, `bfs`, `dfs`, `dijkstra`, `topological-sort`, `components`, `cycle-detection`, `minimum-spanning-tree`, and `playground`. The package uses no runtime framework dependency. Customize inherited CSS tokens such as `--mb-accent`, `--mb-highlight`, and `--mb-bg`.

When adding a model:

1. Add the graph and computation to `packages/graph-studio/models.js`.
2. Render state through the existing `<mb-figure>` custom element unless a genuinely different interaction requires another component.
3. Add the model to `packages/graph-studio/gallery.html` and package docs.
4. Add an assert-based check for the algorithm result and edge cases.
5. Run `npm run build` and `npm test`; open the gallery and exercise controls at desktop and mobile widths.

## Creator kit reference

`kit/iso-kit.mjs` contains the camera, shape helpers, SVG renderer, and card/page builders. `kit/iso.css` provides the inherited isometric visual system. `kit/react/draw.tsx` has server-safe React primitives; `kit/react/live.tsx` has client-side easing, visibility, and stillness helpers. Relevant source craft notes remain in `references/craft.md`, `references/motion.md`, `references/verify.md`, and `references/kit.md`.

## Deliverable

Return the working figure source and a short handoff that says what model it encodes, how to operate it, the exact checks run, and any assumptions that affect correctness. Do not publish or deploy without a direct request.
