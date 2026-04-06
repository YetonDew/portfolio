---
title: "Sixel Animation Notes"
label: "Article"
description: "Concept and implementation details for the Sixel-inspired Cell 3 animation."
---

Sixel is a visual experiment for Cell 3 that mixes a terminal look with lightweight UI motion.

The goal is to keep the card compact while still communicating "process" and "flow":

- a pinned header with status dots,
- a terminal body with command-like text,
- and a cursor animation that suggests active work.

In dark mode, the palette leans into contrast and glow to preserve readability.
In light mode, the same structure uses softer tones while preserving the same hierarchy.

This component is intentionally self-contained, so styles and animation timelines stay local to the card and are easy to iterate without affecting the rest of the layout.
