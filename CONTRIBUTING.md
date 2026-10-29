# Contributing to Mechanicals & Blueprints

Keep each figure truthful to one underlying model. Every number in a figure, caption, and readout must come from the graph or algorithm being shown.

## Local checks

Requirements: Node.js 20.10 or later. No package installation is needed for the graph package.

```sh
npm run build
npm test
```

Open `packages/graph-studio/gallery.html` in a browser and inspect all models, controls, focus, mobile sizing, and reduced motion. For changes to inherited isometric tooling, also run the relevant scripts in `scripts/` and inspect generated screenshots. Chrome or Chromium is needed for browser capture and geometry checks.

## Model changes

Add data and a state generator in `packages/graph-studio/models.js`, then cover its final values and edge cases in `packages/graph-studio/model.test.mjs`. Reuse the shared figure element and brand tokens. Do not introduce a runtime framework dependency for a model.

## Attribution

Adaptations of Anatomy source must retain its MIT notice. Keep the source history and attribution clear in `LICENSE` and `NOTICE`; do not claim retained upstream examples as original Mechanicals & Blueprints work.
