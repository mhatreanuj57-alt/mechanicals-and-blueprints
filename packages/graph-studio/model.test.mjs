import test from "node:test";
import assert from "node:assert/strict";
import { framesFor, graphModels, modelIds, neighbors } from "./models.js";

test("all ten graph studies have usable models and coherent frames", () => {
  assert.equal(modelIds.length, 10);
  for (const id of modelIds) {
    const model = graphModels[id];
    assert.ok(model.title && model.description);
    assert.ok(model.nodes.length > 0);
    assert.ok(framesFor(id, model).length > 0);
    assert.ok(model.edges.every((e) => model.nodes.some((n) => n.id === e.from) && model.nodes.some((n) => n.id === e.to)));
  }
});

test("representations use the graph adjacency and BFS/DFS visit every reachable vertex", () => {
  assert.deepEqual(neighbors(graphModels["graph-basics"], "A"), ["B", "C"]);
  for (const id of ["bfs", "dfs"]) {
    const final = framesFor(id).at(-1);
    assert.deepEqual(new Set(final.order), new Set(["A", "B", "C", "D", "E", "F"]));
  }
});

test("algorithm readouts match their graph results", () => {
  assert.equal(framesFor("dijkstra").at(-1).distances.F, 13);
  assert.match(framesFor("dijkstra").at(-1).message, /A → C → B → D → E → F/);
  const topo = framesFor("topological-sort").at(-1).order;
  for (const e of graphModels["topological-sort"].edges) assert.ok(topo.indexOf(e.from) < topo.indexOf(e.to));
  assert.equal(framesFor("components").at(-1).groups.length, 3);
  assert.match(framesFor("cycle-detection").at(-1).message, /Cycle detected/);
  assert.equal(framesFor("minimum-spanning-tree").at(-1).chosen.reduce((sum, e) => sum + e.weight, 0), 11);
});
