# Project guidance

## Product

Continue the existing «Съедобная атлетика — триатлет на подкормке» browser game. It is a mobile-first tamagotchi about a triathlete, with club identity and food humor integrated into mechanics, copy and art. The owner wants to share a public browser link with friends for playtesting.

Read `docs/HANDOFF.md`, `docs/KNOWN_ISSUES.md` and `docs/QA.md` before a substantive change. Use `docs/GAME_RULES.md` for current mechanics and `docs/DEPLOYMENT.md` for hosting context. Code is authoritative when documentation differs.

## Work conventions

- Continue from the current implementation; avoid a framework rewrite unless the task needs one.
- UI language is Russian, with occasional short, clear English terms. The owner prefers concrete, direct communication and practical progress.
- Preserve club tone: warm, playful, about sport and appetite. No guilt or punishment for being away.
- Main target is a phone, including narrow screens, safe areas and thumb-friendly controls. Keep desktop usable.
- The owner also develops entirely from a phone via Codex Cloud. Run commands yourself and provide review/preview links; do not make a local desktop checkout a required step. See `START_HERE.md` for the cloud setup.
- Distinguish a suggested backlog item from a requested feature. Optional accounts, leaderboards and analytics have not been requested.
- Perform routine implementation and verification autonomously within the requested task. Explain actual blockers; do not turn routine local steps into approval questions.

## Source and commands

- This is buildless HTML/CSS/ES-module JavaScript. `dist/` IS the source, not disposable build output.
- `dist/game.js` contains the game model. Keep it independent of DOM/browser APIs.
- `dist/app.js` owns rendering, events, dialogs, saving and race orchestration.
- `dist/scene.js` draws original Canvas artwork. No external image or audio dependencies are needed.
- Node.js >=22. No `npm install` is needed for the baseline.
- Start: `npm run dev` (http://127.0.0.1:5173/).
- Checks: `npm run check`; model tests only: `npm test`.
- Balance reproduction: `npm run inspect:balance`.
- Server binds to loopback by default. `TRIBUDDY_HOST` and `TRIBUDDY_PORT` are optional local settings.

## Data and compatibility

- `localStorage['tribuddy-v1']` contains all player progress. `version: 1` is the current schema.
- Preserve existing saves. Add explicit migration and recovery if changing the schema/key.
- Different origins (domain, protocol or port) have separate storage. Do not promise automatic migration across hosts/devices.
- Never render player-controlled strings with raw HTML. Preserve escaping/textContent.
- Do not add paid services, trackers, remote data collection or authentication as an incidental refactor.
- Currency is fictional. The baseline has no network economy and no anti-cheat server.

## Validation and delivery

Run checks appropriate to the change. Add meaningful regression coverage for model/save/race changes. For UI changes, inspect phone widths 360, 390 and 430 px when browser tooling is available, and report the exact limits of that inspection. A campaign simulation is not proof of iPhone Safari compatibility.

Update relevant docs for material behavior changes. Explain what changed, how it was checked and any remaining limitation.

The existing hosted site is PUBLIC by the owner's explicit request. Preserve its audience. `.openai/hosting.json` identifies that existing Site; it is not an access credential. See `docs/DEPLOYMENT.md` before publishing. Local development does not publish anything automatically.
