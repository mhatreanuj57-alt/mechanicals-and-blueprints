# Mechanicals & Blueprints

**Interactive graph explainers, built from the model outward.** A creator skill, a small framework-free figure package, and a gallery of ten working graph models.

> Brand assumption: DS-Graph could not be located in the supplied workspace. This first pass uses ink, blueprint blue, teal, and amber tokens; replace those values if the existing DS-Graph system becomes available.

The visible wordmark is typographic (**Mechanicals & Blueprints**); no logo asset was supplied. The dark ink `#101923` and panel `#172532` ground the interface, blueprint blue shapes the graph, teal `#44D7C2` marks progress, and amber `#FFBD69` marks the current step. The GitHub-compatible repository slug is `mechanicals-and-blueprints` because GitHub repository names cannot contain spaces or `&`.

## Quick start

```sh
npm install mechanicals-and-blueprints
```

```html
<script type="module">
  import "mechanicals-and-blueprints";
</script>

<mb-figure model="bfs"></mb-figure>
```

The package has no runtime dependencies. It registers a custom element and reads colors from CSS custom properties. See [`packages/graph-studio/README.md`](packages/graph-studio/README.md) and the [interactive gallery](packages/graph-studio/examples/index.html).

## Creator skill

This repository includes a branded Agent Skill and a browser-based [figure workshop](creator.html). Install the skill into a project with:

```sh
npx skills add mhatreanuj57-alt/mechanicals-and-blueprints --skill mechanicals-and-blueprints
```

Or copy `SKILL.md`, `references/`, and the creator kit into your agent's skill directory. See [creator setup](CREATOR.md).

## What ships

- **Creator:** browser-based model editing/preview plus the model-first skill and upstream Anatomy SVG craft kit, audits, capture and build scripts.
- **Skill:** graph-centered guidance for producing editable, accessible, model-driven explainers.
- **Package:** one framework-free custom element with ten independently selectable models.
- **Gallery:** [live figures](packages/graph-studio/gallery.html), source examples, keyboard guidance, and theme tokens.

## Development

```sh
npm run build
npm test
```

Node.js 20.10+ is required for the inherited creator kit. Package build and model checks use Node built-ins; browser capture checks also need Chrome or Chromium.

## Attribution and license

The creator kit and portions of the skill workflow are adapted from [Anatomy by Ryan](https://github.com/wheresryan22/anatomy), licensed under MIT. The figure package's framework-free integration pattern was studied from [anatomy-figures](https://github.com/wheresryan22/anatomy-figures), also MIT; its source code and demo models are not included here. The original Anatomy `LICENSE` is retained. See [`NOTICE`](NOTICE) for details.
