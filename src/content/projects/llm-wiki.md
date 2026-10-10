---
title: LLM Wiki
status: active
summary: A personal markdown knowledge base in the Karpathy pattern, built with Claude Code and exposed over MCP.
order: 3
---

A personal wiki that an LLM maintains, following the three-layer pattern from [Karpathy's LLM wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f): sources are immutable, the wiki is LLM-owned, and a single schema file tells the agent how to work.

## The layers

| Layer | Owner | What lives there |
| ------- | ----- | ---------------- |
| sources/ | Immutable | Raw material: notes, book summaries, saved articles |
| archive/ | Immutable | Retired projects and old reference |
| wiki/ | The agent | Concept and entity pages, cross-linked and cited |
| CLAUDE.md | Me | The schema: conventions, layout, how to ingest |

It started life as a Notion export. Every page is plain markdown, so it reads the same in an editor, in Obsidian, or through an agent.

## How it stays current

New material lands in an `inbox/` folder. The agent reads it in full, discusses the takeaways, files the source, updates the handful of wiki pages it bears on, and leaves the inbox empty again. Saved articles sync in from Readwise Reader every day, with a weekly digest.

:::note
The rule that matters most: never edit a source. Sources record what was believed when written; the wiki records what we believe now.
:::

## Reaching it from anywhere

The wiki is exposed over MCP, so any agent session can search and read it without a copy of the repo. Projects and to-dos deliberately live elsewhere (a Trello board); the wiki is for what I know, not what I'm doing.
