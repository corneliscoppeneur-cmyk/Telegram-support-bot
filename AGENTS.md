# Instructions for coding assistants

Read README.md and docs/WEITERE-BOTS-DE.md before modifying this project.

- Target Telegram Serverless, not a conventional Node.js server.
- Use official documentation at https://core.telegram.org/bots/serverless.
- Preserve routing, verification, and topic close/reopen behavior unless changes are requested.
- Keep each deployed bot's configuration and credentials separate.
- Never commit tokens, `.tgcloud`, private group IDs, or uploaded credential files.
- Run `node test.mjs` for routing changes. These tests mock the platform; report this limitation.
- Check deployed state before `push`. Do not delete unrelated cloud modules.
- Review database migrations before applying them.
- Keep README sections ordered German, English, AI assistant instructions.
- Preserve upstream attribution and do not invent a license.
