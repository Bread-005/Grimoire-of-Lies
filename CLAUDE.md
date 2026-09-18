# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Grimoire of Lies is a single-player deduction game in the spirit of "Deception"/demon-bluff games, but using *Blood on the Clocktower* roles. The user plays alone against the app: it simulates all other players, and the user listens to what each simulated player claims to be and what information they give, then tries to deduce who is actually good or evil. Good players tell the truth (unless drunk or poisoned); evil players lie about their role and information.

Plain client-side JS, no build step, no framework, no package.json. `index.html` loads `main.js` as an ES module directly in the browser.

## Running the app

There is no build/test/lint tooling. Open `index.html` via a local static server (e.g. the JetBrains built-in server referenced in `main.js`, or any `python -m http.server`/`live-server`). It depends on:
- `login-page` app running at `http://localhost:63342/login-page/index.html` for auth (redirects there if `login-page` localStorage is missing).
- A remote backend at `https://hobby-projects-api.onrender.com` (`API_URL` in `shortcuts.js`) for user auth/lookup and for posting completed-game stats to `/grimoire-of-lies/games/create`.
- Character icons fetched from the `icons/` folder of the `Bread-005/Clocktower-Homebrew-Collection` GitHub repo via `raw.githubusercontent.com`.

There are no automated tests.

## Architecture

### Core files
- `main.js` — app entry point (`DOMContentLoaded`). Bootstraps `localStorage["grimoire-of-lies"]` state, handles login/user verification against the remote API, renders the circular seating UI (`#grimoire`), and wires up player-count and role-selection controls.
- `roleSelection.js` — the game engine. Holds the in-memory `players` array (the single source of truth during a game) and drives the whole game loop:
  - `startGame()` — validates the selected role set against `characterTypeDistribution` (townsfolk/outsider/minion/demon counts per player count), then calls `setupPlayers()` and `startNight()`.
  - `setupPlayers()` — randomly assigns real roles and each player's public "bluff" (the role shown to other players/claimed identity).
  - `startNight()` → `preDeathNightActions()` (per-role night actions like Poisoner/Monk/Gambler/Sailor/etc.) → `nightDeaths()` (demon kills) → `giveInformation()` (calls each Townsfolk role's `*Info(player)` function, then `showClaims()` to render bluffs/info on the grimoire UI).
  - `dies(player, phase, attacker, isExecution)` — the central death-resolution function; every protection (Soldier, Monk, Tea Lady, Devil's Advocate, Pacifist, Sailor), death side-effect (Grandmother, Scarlet Woman takeover, Zombuul lives), and win-condition check funnels through here.
  - `executePlayer(executed)` / `nominate(seat1, seat2)` — day-phase actions; nominate handles Virgin-specific logic. Typed into a hidden `<input>` as `nominate <seat1> <seat2>` or `slayer <seat1> <seat2>` commands (see `startGame()`).
- `shortcuts.js` (root) — cross-cutting app state/utilities: `storage` (the persisted game state object, mirrored to `localStorage["grimoire-of-lies"]`), `loginStorage`, `saveLocalStorage()`, `createPopup()`, `addToLogs()`, `endGame()` (posts final game stats to the backend and reloads).
- `src/shortcuts.js` — game-logic helpers used by role files: `alivePlayers()`, `isDrunk()`, `isGood()`, `roleIsSoberAlive()`, `getsTrueInfo()`/`getsFalseInfo()` (accounts for drunk/poisoned/Spy/Recluse/Vortox misinformation), `getRandomPlayer()`, `getAliveNeighbor()`, `updateDrunkness()` (propagates drunk state through Sailor/Poisoner-style target chains).

### Role modules (`src/roles/**`)
Each character is its own file exporting one or more functions (e.g. `washerwomanInfo`, `monkProtect`/`isMonkProtected`, `assassinKill`). Files are grouped by edition folder (`Trouble Brewing/`, `Bad Moon Rising/`) or left at the top level for cross-edition roles (`knight.js`, `steward.js`). `roleSelection.js` imports every role function directly and calls the relevant ones from `giveInformation()`, `preDeathNightActions()`, `nightDeaths()`, `dies()`, and `executePlayer()` — there is no dynamic role registry, so **adding a new role requires wiring its exported function(s) into `roleSelection.js` by hand**, in addition to adding an entry to `allRoles.json`.

Player objects (defined in `setupPlayers()`) carry ad-hoc fields added by individual roles as needed (e.g. `butlerChain`, `poisonerChain`, `virginNominated`, `drunkSources`, `killTarget`, `evilTarget`) — there is no fixed player schema; check existing role files for the field-naming convention (`<role>Chain`, `<role>Target`) before adding new ones.

### Data
- `allRoles.json` — static list of `{name, characterType}` for every implemented role; drives the role-selection checkboxes in `main.js` and the townsfolk/outsider/minion/demon counting in `roleSelection.js`.
- `characterTypeDistribution` in `roleSelection.js` — the official BOTC townsfolk/outsider/minion/demon split per player count (indexed by player count 0–21).

### State persistence
All game state lives in `localStorage["grimoire-of-lies"]` (`storage` object: `playerCount`, `night`, `startTime`, `selectedRoles`) and `localStorage["login-page"]` (`loginStorage`: `name`, `token`). The in-memory `players` array in `roleSelection.js` is *not* persisted — a page reload loses per-player role/state (only the selected-roles config and night counter survive via `storage`).

### Auth
`main.js` no longer compares a password hash out of `localStorage` against `/users` itself. It sends `loginStorage.token` to `POST /session/verify` on the backend and trusts that server-side answer (`{isValid, name}`) — editing `localStorage` in DevTools can no longer forge a valid session, since validity is decided server-side. The logout button (`#logout-button`, wired in `setupUserName()`) calls `POST /session/delete` with the current token before redirecting back to `login-page`.
