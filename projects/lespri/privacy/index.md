---
layout: default
title: Lespri Bot Privacy Policy
description: Privacy Policy for Lespri Bot.
---

# Lespri Bot Privacy Policy

Effective date: 2026-06-16

Lespri Bot is a Discord bot operated for the NO M.E.G.A.T.R.O.N community. Lespri provides role management, color roles, reaction roles, moderation support, welcome/onboarding tools, image generation commands, and experimental narrated-chat features.

## What Lespri Collects

Lespri may process Discord message content, command inputs, interaction data, Discord user IDs, role IDs, channel IDs, guild IDs, uploaded images, generated images, and moderation actions only when needed to perform a requested bot function.

Lespri does not intentionally collect real names, addresses, phone numbers, emails, government IDs, payment information, or other sensitive personal information. If a user includes such information in a prompt or command, Lespri may attempt to redact or minimize it before processing.

## Image Generation and Prompts

Lespri is designed to minimize retention of image-generation prompts and generated images. Generated local files are treated as temporary work artifacts. The intended operating model is:

- prompts are sanitized before model/provider calls where practical;
- raw prompts are not stored in durable public logs;
- generated images are not kept in permanent local job folders;
- temporary files are deleted after successful delivery or failure;
- button actions use short-lived memory/cache where possible;
- downloads return the generated image to the requesting user when available.

Discord itself may retain messages, attachments, and interaction data according to Discord’s own policies.

## Role and Moderation Data

Lespri may read or update Discord roles when users request self-assignable roles, color roles, reaction roles, or moderator-assisted role changes. Lespri may log privacy-safe audit events such as role IDs, action type, success/failure status, and timestamps.

Lespri does not need to permanently store Discord user message history to provide role and moderation functions.

## Logs

Lespri may keep short operational logs for debugging, safety, abuse prevention, and reliability. Logs should not intentionally contain raw API tokens, full raw prompts, generated image bytes, or unnecessary personally identifying information.

Administrators may periodically purge bot logs, temporary files, and cached job data.

## Third-Party Services

Lespri may use external services for image generation, language-model responses, hosting, DNS, or infrastructure. These services may include Discord, GitHub Pages, cloud hosting providers, AI model providers, and relay services. When possible, Lespri sends only the minimum information needed for the requested action.

## User Control

Users may remove self-assigned roles or color roles through available bot commands or reaction-role controls. Users may request that administrators purge Lespri’s short-lived cached records associated with them, when such records exist.

## Contact

For questions about this policy, contact the server owner or Lespri Bot operator through the NO M.E.G.A.T.R.O.N Discord community.
