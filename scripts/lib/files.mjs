import { readdir } from "node:fs/promises";
import { join } from "node:path";

// Returns every file under `dir` whose name matches `test`.
export async function walk(dir, test) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p, test)));
    else if (test.test(e.name)) out.push(p);
  }
  return out;
}
