# Agent Instructions for Harmony

This file provides context and guidelines for AI coding agents (GitHub Copilot, Cursor, etc.) working on the Harmony project.

## Harmony is a **search engine indexable chat application** @README.md .

## Agent Workflow Guidelines
Before starting any task, read and follow the rules in @WORKFLOW.md 
It defines workflow orchestration, task management, and core principles all agents must follow.

Always check for lint or build errors before committing code.

### Specs/Docs
- No build/test commands for specifications
- Jest/Playwright/Lighthouse referenced in specs are design intent for future implementation

## Key repository conventions
- Dev specs use a strict numbered structure (`1`–`13`; SEO spec also has `14. Acceptance Criteria`).
- Preserve spec labeling prefixes exactly: `M#` (modules), `CL-C#`/`CL-D#`/`CL-E#`/`CL-I#` (classes/DTOs/entities/interfaces), `D#`/`T#`/`F#`/`S#`/`B#` (schemas/tech/flows/states).
- Keep **Section 3 (Class Diagram)** and **Section 4 (List of Classes)** synchronized whenever classes are added/renamed.
- Preserve canonical visibility enum values exactly: `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE`.

- Always verify tests are running successfully in both the backend and the frontend before pushing changes
