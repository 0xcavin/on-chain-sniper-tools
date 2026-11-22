# Skill: on-chain-sniper

Testnet-first workflow for on-chain sniper tasks and the multi-chain burner
wallet. See `SKILL.md` for the full workflow.

## In short

1. **Verify first** — team, docs, contract, token details, stated prizes.
   Missing = pure speculation, do not act.
2. **Testnet-first** — only the testnets in `src/chains.mjs`; mainnet is
   blocked in code.
3. **Dry-run by default** — `node src/dry-run.mjs --task <task> --chain <testnet>`.
   No network calls, no live mode.
4. **Burner only** — public burner addresses, never a holding wallet.
5. **Never paste a seed** — no seed / mnemonic / private key anywhere.
6. **Circle CLI for Arc** — 20 test USDC per Arc Testnet claim; Terms + OTP
   are Cavin's alone.
7. **Verify on the explorer** — tx hash on testnet.arcscan.app (Arc) or the
   chain's testnet explorer before calling anything done.

## Files

- `SKILL.md` — the full skill (name, description, when to use, steps).
- Package root `README.md` — install, usage, faucet table, burner addresses.
- `src/dry-run.mjs`, `src/check-burner-addresses.mjs`, `src/chains.mjs` —
  the scripts this skill drives.

## Install

Copy this `on-chain-sniper/` folder into the skills directory of the repo
(`skills/on-chain-sniper/`) or the agent's skills folder, keeping `SKILL.md`
at its root.
