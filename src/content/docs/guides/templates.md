---
title: "Built-in templates"
description: "The templates that ship with Yorishiro."
sidebar:
  order: 2
---

Yorishiro ships eight templates. Create a schema from one to start with a ready-made set of entity types and relations. Use the MCP tools `list_templates` and `list_template_library`, or the REST API, to browse them. See [MCP tools](../../reference/mcp-tools/).

| Template | For | Entity types |
| --- | --- | --- |
| `general-notes` | General notes with tags and links | note |
| `software-adr` | Architecture decisions, a service catalog, and the tech stack of a software project | decision, service, incident |
| `task-management` | Projects and tasks with deadlines, dependencies, clients, milestones, assignments, work sessions, and handoffs | project, task, client, milestone, assignee, work_session, handoff |
| `research-knowledge-base` | Papers, authors, concepts, experiments, and datasets | paper, author, concept, experiment, dataset |
| `game-dev-lore` | Shared canon for a game: characters, locations, factions, items, events, glossary terms, and assets | character, location, faction, item, event, term, asset |
| `creative-writing` | Long-form writing: characters, places, organizations, items, chapters, scenes, plot threads, and events | character, location, organization, item, chapter, scene, plot_thread, event |
| `trpg-campaign` | Running a TRPG campaign: characters, locations, factions, items, sessions, quests, and encounters | character, location, faction, item, session, quest, encounter |
| `worldbuilding` | Deprecated: characters, locations, factions, and items | character, location, faction, item |

Each template also defines relation types between its entities.

## Deprecated template

`worldbuilding` is deprecated. For new work, use `creative-writing`, `trpg-campaign`, or `game-dev-lore`. The `template_id` value `worldbuilding` keeps working, and existing schemas stay unchanged.
