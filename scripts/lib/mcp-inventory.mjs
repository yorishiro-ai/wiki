// Parses the MCP tool inventory markdown produced by the Yorishiro server tests.

const SCOPE_RE = /\s*\(requires (\w+) scope(?:, [^)]*)?\)\.?/;

function typeLabel(p) {
  const base = Array.isArray(p.type)
    ? p.type.filter((t) => t !== "null").join(" or ")
    : (p.type ?? "any");
  const nullable = Array.isArray(p.type) && p.type.includes("null") ? " or null" : "";
  return `${base}${p.format ? ` (${p.format})` : ""}${nullable}`;
}

function parseTools(section) {
  const tools = [];
  for (const m of section.matchAll(
    /### `(\w+)`\n\n([\s\S]*?)\n\nInput schema:\n\n```json\n([\s\S]*?)\n```/g,
  )) {
    const [, name, rawDescription, schemaJson] = m;
    const schema = JSON.parse(schemaJson);
    const scope = rawDescription.match(SCOPE_RE)?.[1];
    if (!scope) throw new Error(`No scope found in description of ${name}`);
    const description = rawDescription
      .replace(SCOPE_RE, (m, _s, offset, whole) => {
        if (/[.。]$/.test(whole.slice(0, offset))) return "";
        return whole.slice(offset + m.length).trim() ? "." : "";
      })
      .replace(/\s*\n\s*/g, " ")
      .trim()
      .replace(/([^.。])$/, "$1.");
    const required = new Set(schema.required ?? []);
    const params = Object.entries(schema.properties ?? {}).map(([key, p]) => ({
      name: key,
      type: typeLabel(p),
      required: required.has(key),
      description: (p.description ?? "").replace(/\s*\n\s*/g, " ").trim(),
    }));
    tools.push({ name, scope, description, params });
  }
  return tools;
}

/** Returns `{ community, enterprise }`, each a list of `{ name, scope, description, params }`. */
export function parseInventory(text) {
  const [, communityPart, enterprisePart] = text.match(
    /## Community tools([\s\S]*?)## Enterprise-only tools([\s\S]*?)<!-- END GENERATED MCP INVENTORY -->/,
  );
  return { community: parseTools(communityPart), enterprise: parseTools(enterprisePart) };
}
