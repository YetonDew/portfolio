---
title: "PROJECT: SIXEL"
label: "Article"
description: "Smart Intelligent eXtraction & Email Logistics"
repoUrl: "https://github.com/YetonDew/sixel_pubic"
repoLabel: "View on GitHub"
---

I didn’t start Sixel because I wanted to build some polished, impressive product. It actually came from something much more ordinary.

My mother-in-law runs an accounting firm, and for as long as I’ve known her, she’s been complaining about the same thing: emails. Too many emails. Every single day, a constant flood of invoices, documents, random attachments… and somehow, everything still ends up messy. Her employees download files in different ways, name them inconsistently, or just drop everything somewhere. Over time, it turns into chaos.

It wasn’t just annoying, it was slowing down real work. At some point it felt obvious: this shouldn’t be this hard.

That’s when I decided to start building Sixel.

At its core, Sixel is a system that reads incoming emails, downloads attachments, and organizes everything automatically. I integrated the Gmail API to fetch emails and attachments directly, and used Google OCR to extract raw text from PDF documents. That gave me the foundation: getting the data out of files in a structured way.

Initially, I tried to rely heavily on AI to classify and organize everything. In theory, it sounded perfect—just let the model understand the document and decide where it belongs. In reality, it was messy. The AI would make small but critical mistakes: misclassifying documents, confusing clients, or extracting slightly wrong values. In accounting, “almost correct” is still wrong.

So I changed the approach.

Instead of letting AI make decisions, I started using it only for what it’s actually good at: interpreting messy text. The OCR would extract raw, unstructured text from documents, and then the AI would help clean and interpret that text. From there, I built deterministic logic on top of it.

For example, I extract key identifiers like the NIP (tax ID), and then my own system matches that against a database of registered clients. Once there’s a match, everything else—folder structure, document classification, routing—is handled by the program itself, not by AI guesswork.

That shift made everything much more reliable.

It’s still evolving, but the goal has stayed the same from the beginning: take something that was chaotic and frustrating, and make it quietly work in the background.
