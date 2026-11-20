// Parses the MCP tool inventory markdown produced by the Yorishiro server tests.

const SCOPE_RE = /\(requires [^)]*?\b(read|write|schema|migration) scope\b/;

function typeLabel(p: any) {
  const base = Array.isArray(p.type)
    ? p.type.filter((t: string) => t !== "null").join(" or ")
    : (p.type ?? "any");
  const nullable = Array.isArray(p.type) && p.type.includes("null") ? " or null" : "";
  return `${base}${p.format ? ` (${p.format})` : ""}${nullable}`;
}

export interface Param {
  name: string;
  type: string;
  required: boolean;
  description: string;
}
export interface Tool {
  name: string;
  scope: string;
  description: string;
  params: Param[];
}

function parseTools(section: string): Tool[] {
  const tools: Tool[] = [];
  for (const m of section.matchAll(
    /### `(\w+)`\n\n([\s\S]*?)\n\nInput schema:\n\n```json\n([\s\S]*?)\n```/g,
  )) {
    const [, name, rawDescription, schemaJson] = m;
    const schema = JSON.parse(schemaJson);
    const scope =
      rawDescription.match(SCOPE_RE)?.[1] ??
      (/\(requires [^)]*\bthe independent audit grant\b/.test(rawDescription)
        ? "audit"
        : undefined);
    if (!scope) throw new Error(`No scope found in description of ${name}`);
    const description = rawDescription
      .replace(/\s*\n\s*/g, " ")
      .trim()
      .replace(/([^.。])$/, "$1.");
    const required = new Set(schema.required ?? []);
    const params = Object.entries<any>(schema.properties ?? {}).map(([key, p]) => ({
      name: key,
      type: typeLabel(p),
      required: required.has(key),
      description: (p.description ?? "").replace(/\s*\n\s*/g, " ").trim(),
    }));
    tools.push({ name, scope, description, params });
  }
  const headings = [...section.matchAll(/^### /gm)];
  if (headings.length !== tools.length) {
    throw new Error("Invalid MCP inventory: a tool heading or input schema could not be parsed.");
  }
  return tools;
}

/** Returns `{ community, enterprise }`, each a list of `{ name, scope, description, params }`. */
export function parseInventory(text: string) {
  const sections = text
    .replace(/\r\n/g, "\n")
    .match(
      /## Community tools([\s\S]*?)## Enterprise-only tools([\s\S]*?)<!-- END GENERATED MCP INVENTORY -->/,
    );
  if (!sections) throw new Error("Invalid MCP inventory: missing sections or end marker.");
  const [, communityPart, enterprisePart] = sections;
  if (!communityPart.trim()) throw new Error("Invalid MCP inventory: empty community section.");
  return { community: parseTools(communityPart), enterprise: parseTools(enterprisePart) };
}

let inventory: Promise<{ community: Tool[]; enterprise: Tool[] }> | undefined;
/** Fetches the inventory of the documented release once per build. */
export function loadInventory(version: string) {
  inventory ??= fetch(
    `https://raw.githubusercontent.com/yorishiro-ai/yorishiro/${version}/tests/fixtures/mcp-inventory.md`,
  ).then(async (response) => {
    if (!response.ok) throw new Error(`Failed to fetch MCP inventory: HTTP ${response.status}`);
    return parseInventory(await response.text());
  });
  return inventory;
}
