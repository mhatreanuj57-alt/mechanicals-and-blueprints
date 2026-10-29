import { framesFor, graphModels, modelIds, neighbors } from "./models.js";

const css = `
:host{--mb-bg:#101923;--mb-panel:#172532;--mb-ink:#eaf2f7;--mb-muted:#91a6b6;--mb-edge:#526a7d;--mb-node:#1b3546;--mb-accent:#44d7c2;--mb-highlight:#ffbd69;--mb-focus:#9bd5ff;display:block;color:var(--mb-ink);font:500 14px/1.45 Inter,ui-sans-serif,system-ui,sans-serif;min-width:260px}:host([theme="light"]){--mb-bg:#f2f5f6;--mb-panel:#fff;--mb-ink:#142431;--mb-muted:#566a78;--mb-edge:#8ea1ad;--mb-node:#e0edf1;--mb-accent:#087f72;--mb-highlight:#a45300;--mb-focus:#075fbd}*{box-sizing:border-box}.frame{background:var(--mb-bg);border:1px solid color-mix(in srgb,var(--mb-edge) 48%,transparent);border-radius:16px;overflow:hidden}.head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;padding:18px 20px 12px}.eyebrow{color:var(--mb-accent);font-size:11px;font-weight:750;letter-spacing:.14em;text-transform:uppercase}.title{margin:3px 0;font-size:20px;letter-spacing:-.025em}.desc{margin:0;color:var(--mb-muted);max-width:42ch}.count{white-space:nowrap;color:var(--mb-muted);font-variant-numeric:tabular-nums}.stage{background:radial-gradient(ellipse at 48% 46%,color-mix(in srgb,var(--mb-accent) 7%,var(--mb-bg)),var(--mb-bg) 72%);padding:4px 12px 8px}svg{display:block;width:100%;height:auto;max-height:360px;overflow:visible}.edge{stroke:var(--mb-edge);stroke-width:2.2;opacity:.83;transition:stroke .18s,opacity .18s,stroke-width .18s}.edge.active{stroke:var(--mb-highlight);stroke-width:4;opacity:1}.edge.chosen{stroke:var(--mb-accent);stroke-width:4;opacity:1}.edge-label{fill:var(--mb-muted);font-size:12px;text-anchor:middle;paint-order:stroke;stroke:var(--mb-bg);stroke-width:4px;stroke-linejoin:round}.node{cursor:pointer;outline:none}.node circle{fill:var(--mb-node);stroke:var(--mb-edge);stroke-width:2.2;transition:fill .18s,stroke .18s}.node.visited circle{fill:color-mix(in srgb,var(--mb-accent) 28%,var(--mb-node));stroke:var(--mb-accent)}.node.active circle,.node.selected circle{fill:color-mix(in srgb,var(--mb-highlight) 30%,var(--mb-node));stroke:var(--mb-highlight);stroke-width:3}.node:focus-visible circle{stroke:var(--mb-focus);stroke-width:4}.node text{fill:var(--mb-ink);font-size:15px;font-weight:750;text-anchor:middle;dominant-baseline:central;pointer-events:none}.node .sub{font-size:9px;fill:var(--mb-muted);font-weight:600}.info{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;padding:13px 20px;background:var(--mb-panel);border-top:1px solid color-mix(in srgb,var(--mb-edge) 34%,transparent)}.status{margin:0;min-height:22px}.metrics{color:var(--mb-muted);font-size:12px;text-align:right;font-variant-numeric:tabular-nums}.controls{display:flex;gap:8px;flex-wrap:wrap;padding:12px 20px 16px;background:var(--mb-panel)}button,select{font:inherit;color:var(--mb-ink);background:color-mix(in srgb,var(--mb-panel) 86%,var(--mb-edge));border:1px solid color-mix(in srgb,var(--mb-edge) 65%,transparent);border-radius:8px;padding:8px 12px}button{cursor:pointer}button:hover:not(:disabled){border-color:var(--mb-accent);background:color-mix(in srgb,var(--mb-accent) 12%,var(--mb-panel))}button:disabled{opacity:.45;cursor:not-allowed}:focus-visible{outline:3px solid var(--mb-focus);outline-offset:2px}.mode{display:flex;gap:8px;align-items:center;margin-left:auto;color:var(--mb-muted);font-size:12px}.matrix{width:100%;border-collapse:collapse;margin:0 0 12px;font-size:12px;text-align:center;font-variant-numeric:tabular-nums}.matrix th,.matrix td{padding:5px;border:1px solid color-mix(in srgb,var(--mb-edge) 55%,transparent)}.list{margin:0;padding:8px 20px 16px;background:var(--mb-panel);color:var(--mb-muted);display:flex;gap:14px;flex-wrap:wrap}.play-hint{color:var(--mb-muted);font-size:12px;align-self:center}@media(max-width:520px){.head{padding:14px 14px 10px}.title{font-size:18px}.count{font-size:11px}.info{padding:11px 14px;grid-template-columns:1fr}.metrics{text-align:left}.controls{padding:10px 14px 14px}.mode{margin-left:0;width:100%}.stage{padding-inline:5px}}@media(prefers-reduced-motion:reduce){*,*::before,*::after{transition:none!important;scroll-behavior:auto!important}}
`;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const copyModel = (id) => { const m = graphModels[id]; return { ...m, nodes: m.nodes.map((n) => ({ ...n })), edges: m.edges.map((e) => ({ ...e })) }; };

export class MBGraphFigure extends (globalThis.HTMLElement ?? class {}) {
  static observedAttributes = ["model", "theme"];
  constructor() { super(); this.attachShadow({ mode: "open" }); this.step = 0; this.selected = null; this.representation = "list"; this.customModel = null; }
  connectedCallback() { this.customModel ??= copyModel(this.modelId); this.render(); }
  attributeChangedCallback(name) { if (this.isConnected) { if (name === "model") this.customModel = copyModel(this.modelId); this.step = 0; this.render(); } }
  get modelId() { return modelIds.includes(this.getAttribute("model")) ? this.getAttribute("model") : "graph-basics"; }
  get model() { return this.customModel ?? graphModels[this.modelId]; }
  get frames() { return framesFor(this.modelId, this.model); }
  get frame() { return this.frames[Math.min(this.step, this.frames.length - 1)]; }
  move(action) { this.step = action === "next" ? Math.min(this.step + 1, this.frames.length - 1) : action === "previous" ? Math.max(0, this.step - 1) : 0; if (action === "reset") { this.selected = null; if (this.modelId === "playground") this.customModel = copyModel(this.modelId); } this.render(); }
  selectNode(id) {
    if (this.modelId === "playground" && this.selected && this.selected !== id) {
      if (!this.model.edges.some((e) => e.from === this.selected && e.to === id || e.from === id && e.to === this.selected)) this.model.edges.push({ from: this.selected, to: id, weight: 1 });
      this.selected = null;
    } else this.selected = id;
    this.render();
  }
  renderGraph(model, frame) {
    const active = frame.activeEdges ?? [], chosen = frame.chosen ?? [];
    const defs = `<defs><marker id="arrow" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto"><path d="M0 0L9 4L0 8z" fill="var(--mb-edge)"/></marker></defs>`;
    const edges = model.edges.map((e) => {
      const a = model.nodes.find((n) => n.id === e.from), b = model.nodes.find((n) => n.id === e.to); if (!a || !b) return "";
      return `<g><line class="edge${active.includes(e) ? " active" : ""}${chosen.includes(e) ? " chosen" : ""}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"${model.directed ? ' marker-end="url(#arrow)"' : ""} aria-hidden="true"/><text class="edge-label" x="${(a.x + b.x) / 2}" y="${(a.y + b.y) / 2 - 8}" aria-hidden="true">${e.weight !== 1 || ["dijkstra", "minimum-spanning-tree"].includes(this.modelId) ? e.weight : ""}</text></g>`;
    }).join("");
    const nodes = model.nodes.map((n) => {
      const visited = (frame.visited ?? []).includes(n.id), tags = [visited && "visited", frame.active === n.id && "active", this.selected === n.id && "selected"].filter(Boolean).join(" ");
      const sub = frame.distances ? (frame.distances[n.id] === Infinity ? "∞" : frame.distances[n.id]) : frame.indegree ? `in ${frame.indegree[n.id]}` : "";
      return `<g class="node ${tags}" role="button" tabindex="0" data-node="${esc(n.id)}" aria-pressed="${this.selected === n.id}" aria-label="Vertex ${esc(n.id)}${visited ? ", visited" : ""}${frame.distances ? `, distance ${sub}` : ""}"><circle cx="${n.x}" cy="${n.y}" r="24"/><text x="${n.x}" y="${n.y}">${esc(n.id)}</text>${sub ? `<text class="sub" x="${n.x}" y="${n.y + 34}">${sub}</text>` : ""}</g>`;
    }).join("");
    return `<svg viewBox="0 0 510 320" role="group" aria-label="${esc(model.title)} graph, ${model.nodes.length} vertices and ${model.edges.length} edges">${defs}${edges}${nodes}</svg>`;
  }
  readout(model, frame) {
    if (this.modelId === "representations" && this.representation === "matrix") {
      const ids = model.nodes.map((n) => n.id);
      return `<table class="matrix" aria-label="Adjacency matrix"><thead><tr><th scope="col">·</th>${ids.map((id) => `<th scope="col">${id}</th>`).join("")}</tr></thead><tbody>${ids.map((id) => `<tr><th scope="row">${id}</th>${ids.map((to) => `<td>${model.edges.some((e) => e.from === id && e.to === to || !model.directed && e.from === to && e.to === id) ? 1 : 0}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    }
    if (this.modelId === "representations") return `<div class="list" aria-label="Adjacency list">${model.nodes.map((n) => `<span><b>${n.id}</b> → ${neighbors(model, n.id).join(", ") || "∅"}</span>`).join("")}</div>`;
    if (this.modelId === "graph-basics" && this.selected) return `<span class="metrics">Neighbors of ${this.selected}: ${neighbors(model, this.selected).join(", ") || "none"} · degree ${neighbors(model, this.selected).length}</span>`;
    if (this.modelId === "playground") return `<span class="metrics">${this.selected ? `Selected ${this.selected} · click another vertex to connect` : "No vertex selected"} · ${model.nodes.length} vertices · ${model.edges.length} edges</span>`;
    if (frame.distances) return `<span class="metrics">${model.nodes.map((n) => `${n.id}: ${frame.distances[n.id] === Infinity ? "∞" : frame.distances[n.id]}`).join(" · ")}</span>`;
    if (frame.groups) return `<span class="metrics">Groups: ${frame.groups.map((g) => `{${g.join(",")}}`).join(" ") || "—"}</span>`;
    if (frame.order) return `<span class="metrics">Order: ${frame.order.join(" → ") || "—"}</span>`;
    if (frame.frontier) return `<span class="metrics">${["dfs", "cycle-detection", "components"].includes(this.modelId) ? "Stack" : "Queue"}: ${frame.frontier.join(" → ") || "empty"}</span>`;
    if (frame.chosen) return `<span class="metrics">Tree weight: ${frame.chosen.reduce((sum, e) => sum + e.weight, 0)} · ${frame.chosen.length} edges</span>`;
    return `<span class="metrics">${model.nodes.length} vertices · ${model.edges.length} edges${model.directed ? " · directed" : " · undirected"}</span>`;
  }
  render() {
    const model = this.model, frame = this.frame, algorithm = !["graph-basics", "representations", "playground"].includes(this.modelId);
    const extras = this.modelId === "representations" ? `<label class="mode">View <select data-action="representation"><option value="list" ${this.representation === "list" ? "selected" : ""}>Adjacency list</option><option value="matrix" ${this.representation === "matrix" ? "selected" : ""}>Adjacency matrix</option></select></label>` : this.modelId === "playground" ? `<button data-action="add">Add vertex</button><button data-action="remove" ${this.selected ? "" : "disabled"}>Remove selected</button><button data-action="clear">Clear graph</button><span class="play-hint">Select two vertices to connect them.</span>` : "";
    const controls = algorithm ? `<button data-action="previous" ${this.step === 0 ? "disabled" : ""}>Previous</button><button data-action="next" ${this.step === this.frames.length - 1 ? "disabled" : ""}>Next step</button><button data-action="reset">Reset</button>${extras}` : `${extras}<button data-action="reset">Reset</button>`;
    this.shadowRoot.innerHTML = `<style>${css}</style><section class="frame" aria-label="${esc(model.title)} interactive figure"><header class="head"><div><div class="eyebrow">Mechanicals &amp; Blueprints · Graph study</div><h2 class="title">${esc(model.title)}</h2><p class="desc">${esc(model.description)}</p></div><span class="count">${algorithm ? `${this.step + 1} / ${this.frames.length}` : `${model.nodes.length} vertices`}</span></header><div class="stage">${this.renderGraph(model, frame)}</div><div class="info"><p class="status" aria-live="polite">${esc(frame.message ?? model.description)}</p>${this.readout(model, frame)}</div><nav class="controls" aria-label="Figure controls">${controls}</nav></section>`;
    this.shadowRoot.querySelectorAll("[data-action]").forEach((el) => el.addEventListener(el.tagName === "SELECT" ? "change" : "click", (event) => this.action(event)));
    this.shadowRoot.querySelectorAll("[data-node]").forEach((el) => {
      el.addEventListener("click", () => this.selectNode(el.dataset.node));
      el.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.stopPropagation(); this.selectNode(el.dataset.node); } });
    });
    this.onkeydown = (event) => {
      if (event.target.closest?.("[data-node]") || ["SELECT", "INPUT", "TEXTAREA"].includes(event.target.tagName)) return;
      if (event.key === "ArrowRight" || event.key === " ") { event.preventDefault(); this.move("next"); }
      if (event.key === "ArrowLeft") { event.preventDefault(); this.move("previous"); }
      if (event.key === "Home") { event.preventDefault(); this.move("reset"); }
    };
  }
  action(event) {
    const action = event.currentTarget.dataset.action;
    if (action === "representation") { this.representation = event.currentTarget.value; this.render(); }
    else if (["next", "previous", "reset"].includes(action)) this.move(action);
    else if (action === "add") {
      const ids = this.model.nodes.map((n) => n.id), next = Math.max(64, ...ids.map((id) => id.charCodeAt(0))) + 1, id = String.fromCharCode(next);
      if (next > 90) return;
      const angle = this.model.nodes.length * 2.4; this.model.nodes.push({ id, x: 255 + Math.cos(angle) * 82, y: 160 + Math.sin(angle) * 82 }); this.selected = id; this.render();
    } else if (action === "remove" && this.selected) {
      this.model.nodes = this.model.nodes.filter((n) => n.id !== this.selected); this.model.edges = this.model.edges.filter((e) => e.from !== this.selected && e.to !== this.selected); this.selected = null; this.render();
    } else if (action === "clear") { this.customModel = { ...this.model, nodes: [], edges: [] }; this.selected = null; this.render(); }
  }
}

export function defineGraphFigure() {
  if (typeof customElements !== "undefined" && !customElements.get("mb-figure")) customElements.define("mb-figure", MBGraphFigure);
}
if (typeof customElements !== "undefined") defineGraphFigure();
