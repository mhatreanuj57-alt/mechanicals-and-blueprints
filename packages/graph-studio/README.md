# `mechanicals-and-blueprints`

Framework-free interactive graph figures. Runtime dependency count: zero.

## Browser use

```sh
npm install mechanicals-and-blueprints
```

```js
import "mechanicals-and-blueprints";
```

```html
<mb-figure model="dijkstra" theme="blueprint"></mb-figure>
```

Supported `model` values: `graph-basics`, `representations`, `bfs`, `dfs`, `dijkstra`, `topological-sort`, `components`, `cycle-detection`, `minimum-spanning-tree`, and `playground`. The element uses a responsive SVG and renders its own controls and live status. It can be used in plain HTML, React, Vue, or another framework without a framework adapter.

## JavaScript API

React can render the custom element directly (this API uses string attributes and needs no React adapter):

```jsx
import "mechanicals-and-blueprints";

export function Lesson() {
  return <mb-figure model="bfs" theme="blueprint" />;
}
```

```js
import { defineGraphFigure, graphModels } from "mechanicals-and-blueprints";

defineGraphFigure(); // Safe to call more than once.
console.log(Object.keys(graphModels));
```

The element accepts `model` and `theme` attributes. `theme="light"` selects the light preset; the default is blueprint-dark. For custom themes, set these properties on the element or an ancestor:

| Token | Default | Purpose |
|---|---|---|
| `--mb-bg` | `#101923` | Canvas |
| `--mb-panel` | `#172532` | Figure and control panels |
| `--mb-ink` | `#eaf2f7` | Main text |
| `--mb-muted` | `#91a6b6` | Secondary text |
| `--mb-edge` | `#526a7d` | Graph edges |
| `--mb-node` | `#1b3546` | Node fill |
| `--mb-accent` | `#44d7c2` | Active and visited state |
| `--mb-highlight` | `#ffbd69` | Current step and selected node |
| `--mb-focus` | `#9bd5ff` | Keyboard focus ring |

```css
mb-figure { --mb-accent: #79e2b8; --mb-highlight: #ffc857; }
```

## Controls and accessibility

Use **Next step**, **Previous**, and **Reset** buttons or Left/Right, Home, and Space while the figure has focus. Graph nodes are buttons with accessible names. The live status announces model changes; SVG edges and nodes remain readable without animation. Motion is limited to short state transitions and respects `prefers-reduced-motion`. No audio is used.

The playground supports adding/removing nodes, connecting two selected nodes, and clearing the graph. State is local to the element and resets when the page reloads.

## Examples

Open [`gallery.html`](gallery.html) from this package directory to see all ten models. The root README includes the install command and minimal embed.
