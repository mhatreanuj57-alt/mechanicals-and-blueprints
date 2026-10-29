const baseNodes = [
  { id: "A", x: 72, y: 160 }, { id: "B", x: 172, y: 70 },
  { id: "C", x: 172, y: 250 }, { id: "D", x: 310, y: 70 },
  { id: "E", x: 310, y: 250 }, { id: "F", x: 438, y: 160 },
];
const edge = (from, to, weight = 1) => ({ from, to, weight });
const undirected = [edge("A", "B"), edge("A", "C"), edge("B", "D"), edge("B", "E"), edge("C", "D"), edge("C", "E"), edge("D", "F"), edge("E", "F")];

export const graphModels = {
  "graph-basics": { title: "Graph fundamentals", description: "Select a vertex to inspect its neighborhood.", directed: false, nodes: baseNodes, edges: undirected },
  representations: { title: "Adjacency list & matrix", description: "Switch representations and inspect the same graph.", directed: false, nodes: baseNodes, edges: undirected },
  bfs: { title: "Breadth-first search", description: "Watch the queue visit vertices by distance from A.", directed: false, nodes: baseNodes, edges: undirected },
  dfs: { title: "Depth-first search", description: "Follow one branch deeply before backtracking.", directed: false, nodes: baseNodes, edges: undirected },
  dijkstra: { title: "Weighted shortest path", description: "Relax positive edge weights from A to F.", directed: false, nodes: baseNodes, edges: [edge("A", "B", 4), edge("A", "C", 2), edge("B", "C", 1), edge("B", "D", 5), edge("C", "D", 8), edge("C", "E", 10), edge("D", "E", 2), edge("D", "F", 6), edge("E", "F", 3)] },
  "topological-sort": { title: "Directed order", description: "Remove zero-indegree vertices from this DAG.", directed: true, nodes: baseNodes, edges: [edge("A", "C"), edge("B", "C"), edge("C", "D"), edge("C", "E"), edge("D", "F"), edge("E", "F")] },
  components: { title: "Connected components", description: "Explore each connected island in turn.", directed: false, nodes: baseNodes, edges: [edge("A", "B"), edge("B", "C"), edge("D", "E")] },
  "cycle-detection": { title: "Cycle detection", description: "A back edge closes a cycle in the graph.", directed: false, nodes: baseNodes, edges: [edge("A", "B"), edge("B", "C"), edge("C", "D"), edge("D", "B"), edge("D", "E"), edge("E", "F")] },
  "minimum-spanning-tree": { title: "Minimum spanning tree", description: "Kruskal's algorithm adds the lightest safe edge.", directed: false, nodes: baseNodes, edges: [edge("A", "B", 4), edge("A", "C", 3), edge("B", "C", 1), edge("B", "D", 2), edge("C", "D", 4), edge("C", "E", 5), edge("D", "E", 2), edge("D", "F", 6), edge("E", "F", 3)] },
  playground: { title: "Graph playground", description: "Add vertices, select two, then connect them.", directed: false, nodes: baseNodes.slice(0, 4), edges: [edge("A", "B"), edge("A", "C"), edge("B", "D")] },
};

export const modelIds = Object.keys(graphModels);
export function neighbors(model, id) {
  return model.edges.flatMap((e) => e.from === id ? [e.to] : !model.directed && e.to === id ? [e.from] : []);
}

function walkFrames(model, depthFirst = false) {
  const frames = [{ message: "Start at A.", visited: [], frontier: ["A"], order: [], activeEdges: [] }];
  const todo = ["A"], visited = new Set(), order = [], activeEdges = [];
  while (todo.length) {
    const at = depthFirst ? todo.pop() : todo.shift();
    if (visited.has(at)) continue;
    visited.add(at); order.push(at);
    frames.push({ message: `Visit ${at}.`, visited: [...visited], frontier: [...todo], order: [...order], active: at, activeEdges: [...activeEdges] });
    const next = neighbors(model, at);
    if (depthFirst) next.reverse();
    for (const to of next) {
      if (visited.has(to) || todo.includes(to)) continue;
      todo.push(to);
      const e = model.edges.find((item) => item.from === at && item.to === to || !model.directed && item.to === at && item.from === to);
      if (e) activeEdges.push(e);
    }
    frames.push({ message: `${depthFirst ? "Stack" : "Queue"}: ${todo.length ? todo.join(" → ") : "empty"}.`, visited: [...visited], frontier: [...todo], order: [...order], active: at, activeEdges: [...activeEdges] });
  }
  frames.push({ message: `Traversal complete: ${order.join(" → ")}.`, visited: [...visited], frontier: [], order: [...order], activeEdges: [...activeEdges] });
  return frames;
}

function dijkstraFrames(model) {
  const distances = Object.fromEntries(model.nodes.map((n) => [n.id, Infinity])); distances.A = 0;
  const previous = {};
  const done = new Set(), frames = [{ message: "Distance(A) = 0; all other distances are ∞.", distances: { ...distances }, visited: [], active: "A", activeEdges: [] }];
  while (done.size < model.nodes.length) {
    const at = model.nodes.map((n) => n.id).filter((id) => !done.has(id)).sort((a, b) => distances[a] - distances[b])[0];
    if (distances[at] === Infinity) break;
    done.add(at); frames.push({ message: `Settle ${at} at distance ${distances[at]}.`, distances: { ...distances }, visited: [...done], active: at, activeEdges: [] });
    for (const to of neighbors(model, at)) {
      if (done.has(to)) continue;
      const e = model.edges.find((item) => item.from === at && item.to === to || item.to === at && item.from === to);
      const candidate = distances[at] + e.weight, improved = candidate < distances[to];
      if (improved) { distances[to] = candidate; previous[to] = at; }
      frames.push({ message: `${at} → ${to}: ${candidate}${improved ? " improves" : " does not improve"} the current distance.`, distances: { ...distances }, visited: [...done], active: to, activeEdges: [e] });
    }
  }
  const path = [];
  for (let at = "F"; at; at = previous[at]) { path.unshift(at); if (at === "A") break; }
  const pathEdges = path.slice(1).map((to, i) => model.edges.find((e) => e.from === path[i] && e.to === to || e.to === path[i] && e.from === to)).filter(Boolean);
  frames.push({ message: `Shortest path ${path.join(" → ")} has length ${distances.F}.`, distances: { ...distances }, visited: [...done], active: "F", activeEdges: pathEdges });
  return frames;
}

function topoFrames(model) {
  const indegree = Object.fromEntries(model.nodes.map((n) => [n.id, 0])); model.edges.forEach((e) => indegree[e.to]++);
  const queue = model.nodes.map((n) => n.id).filter((id) => indegree[id] === 0), order = [];
  const frames = [{ message: `Zero-indegree queue: ${queue.join(", ")}.`, indegree: { ...indegree }, frontier: [...queue], order: [], visited: [], activeEdges: [] }];
  while (queue.length) {
    const at = queue.shift(); order.push(at);
    frames.push({ message: `Place ${at} next in the topological order.`, indegree: { ...indegree }, frontier: [...queue], order: [...order], visited: [...order], active: at, activeEdges: [] });
    for (const e of model.edges.filter((item) => item.from === at)) {
      indegree[e.to]--; if (indegree[e.to] === 0) queue.push(e.to);
      frames.push({ message: `Remove ${at} → ${e.to}; indegree(${e.to}) is now ${indegree[e.to]}.`, indegree: { ...indegree }, frontier: [...queue], order: [...order], visited: [...order], active: e.to, activeEdges: [e] });
    }
  }
  frames.push({ message: `Topological order: ${order.join(" → ")}.`, indegree: { ...indegree }, frontier: [], order: [...order], visited: [...order], activeEdges: [] });
  return frames;
}

function componentFrames(model) {
  const seen = new Set(), groups = [], frames = [{ message: "No vertices explored yet.", visited: [], frontier: [], groups: [], activeEdges: [] }];
  for (const node of model.nodes) {
    if (seen.has(node.id)) continue;
    const stack = [node.id], group = [];
    while (stack.length) {
      const at = stack.pop(); if (seen.has(at)) continue;
      seen.add(at); group.push(at);
      frames.push({ message: `Explore ${at}; current component is {${group.join(", ")}}.`, visited: [...seen], frontier: [...stack], groups: [...groups, [...group]], active: at, activeEdges: [] });
      neighbors(model, at).forEach((next) => { if (!seen.has(next) && !stack.includes(next)) stack.push(next); });
    }
    groups.push(group); frames.push({ message: `Component ${groups.length}: {${group.join(", ")}}.`, visited: [...seen], frontier: [], groups: groups.map((g) => [...g]), activeEdges: [] });
  }
  frames.push({ message: `${groups.length} connected components found.`, visited: [...seen], frontier: [], groups: groups.map((g) => [...g]), activeEdges: [] });
  return frames;
}

function cycleFrames(model) {
  const frames = [{ message: "Begin depth-first search.", visited: [], frontier: ["A"], activeEdges: [], cycle: [] }];
  const seen = new Set(), parent = new Map(), stack = [{ id: "A", from: null }];
  while (stack.length) {
    const { id, from } = stack.pop();
    if (seen.has(id)) {
      if (from && parent.get(from) !== id && parent.get(id) !== from) {
        const found = model.edges.find((e) => e.from === from && e.to === id || e.to === from && e.from === id);
        frames.push({ message: `Found a visited neighbor ${id} from ${from}: a cycle is present.`, visited: [...seen], active: from, activeEdges: found ? [found] : [], cycle: [from, id] }); break;
      }
      continue;
    }
    seen.add(id); parent.set(id, from); frames.push({ message: `Visit ${id}.`, visited: [...seen], active: id, activeEdges: [], cycle: [] });
    for (const next of neighbors(model, id).reverse()) if (next !== from) stack.push({ id: next, from: id });
  }
  const found = frames.some((f) => f.cycle?.length);
  frames.push({ message: found ? "Cycle detected." : "No cycle found.", visited: [...seen], activeEdges: [], cycle: frames.find((f) => f.cycle?.length)?.cycle ?? [] });
  return frames;
}

function mstFrames(model) {
  const parent = Object.fromEntries(model.nodes.map((n) => [n.id, n.id]));
  const find = (id) => { while (parent[id] !== id) id = parent[id]; return id; };
  const chosen = [], frames = [{ message: "Sort edges from lightest to heaviest.", visited: [], chosen: [], activeEdges: [] }];
  for (const e of [...model.edges].sort((a, b) => a.weight - b.weight || a.from.localeCompare(b.from))) {
    const a = find(e.from), b = find(e.to), accepted = a !== b;
    if (accepted) { parent[a] = b; chosen.push(e); }
    frames.push({ message: `${e.from}–${e.to} (${e.weight}) ${accepted ? "joins two components" : "would form a cycle"}; ${accepted ? "keep" : "skip"} it.`, visited: [...new Set(chosen.flatMap((item) => [item.from, item.to]))], chosen: [...chosen], activeEdges: [e] });
    if (chosen.length === model.nodes.length - 1) break;
  }
  frames.push({ message: `Minimum spanning tree weight: ${chosen.reduce((sum, e) => sum + e.weight, 0)}.`, chosen: [...chosen], activeEdges: [] });
  return frames;
}

export function framesFor(id, model = graphModels[id]) {
  if (!model) throw new RangeError(`Unknown graph model: ${id}`);
  if (id === "bfs") return walkFrames(model);
  if (id === "dfs") return walkFrames(model, true);
  if (id === "dijkstra") return dijkstraFrames(model);
  if (id === "topological-sort") return topoFrames(model);
  if (id === "components") return componentFrames(model);
  if (id === "cycle-detection") return cycleFrames(model);
  if (id === "minimum-spanning-tree") return mstFrames(model);
  return [{ message: model.description, visited: [], activeEdges: [] }];
}
