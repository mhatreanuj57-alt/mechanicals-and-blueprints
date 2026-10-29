import { cp, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const out = join(root, "dist");
await mkdir(out, { recursive: true });
for (const file of ["index.js", "register.js", "element.js", "models.js"]) await cp(join(here, file), join(out, file));
await cp(join(here, "graph-studio.css"), join(out, "graph-studio.css"));
console.log("Built mechanicals-and-blueprints to dist/");
