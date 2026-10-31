import assert from "node:assert/strict";
import { test } from "node:test";
import { parseInventory } from "./lib/mcp-inventory.mjs";

const tool =
  '### `get_note`\n\nGets a note (requires read scope).\n\nInput schema:\n\n```json\n{"type":"object","required":["id"],"properties":{"id":{"type":["string","null"],"format":"uuid","description":"Note ID"}}}\n```';
const inventory = `## Community tools\n\n${tool}\n\n## Enterprise-only tools\n\n<!-- END GENERATED MCP INVENTORY -->`;

test("inventory parses scopes, required and nullable parameters, and CRLF", () => {
  for (const input of [inventory, inventory.replaceAll("\n", "\r\n")]) {
    const { community, enterprise } = parseInventory(input);
    assert.equal(enterprise.length, 0);
    assert.equal(community.length, 1);
    assert.equal(community[0].scope, "read");
    assert.deepEqual(community[0].params[0], {
      name: "id",
      type: "string (uuid) or null",
      required: true,
      description: "Note ID",
    });
  }
});

test("inventory preserves role restrictions and the independent audit grant", () => {
  for (const [requirement, scope] of [
    ["read scope and tenant Admin or Owner; issuer ceilings apply", "read"],
    ["read scope and matching account email", "read"],
    [
      "the independent audit grant; tenant or workspace administration does not grant audit access",
      "audit",
    ],
  ]) {
    const { community } = parseInventory(inventory.replace("read scope", requirement));
    assert.equal(community[0].scope, scope);
    assert.ok(community[0].description.includes(requirement));
  }
});

test("invalid inventories fail instead of silently dropping tools", () => {
  for (const input of [
    "Not found",
    inventory.replace(tool, ""),
    inventory.replace("Input schema:", "Schema:"),
    inventory.replace("read scope", "unknown permission"),
  ]) {
    assert.throws(() => parseInventory(input));
  }
});
