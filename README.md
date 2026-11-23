# @0xcavin/on-chain-sniper-tools

Testnet-only dry-run tooling for on-chain sniper tasks and the multi-chain
burner wallet. Scripts + docs only — **no live trades, no mainnet, no keys,
no funds moved.**

By [@0xcavin](https://github.com/0xcavin) · Site: https://0xcavin.github.io ·
Telegram: [@airdropfind](https://t.me/airdropfind)

> **DYOR — don't trust, verify. Not your keys, not your coins.**
> Verify every project for legitimacy first. A project with no team, no docs,
> no token details, and no stated prizes is pure speculation — never connect a
> wallet holding anything to it.

## What it is

- `src/dry-run.mjs` — sniper-task runner. Prints the planned steps for a task
  on a testnet. **Dry-run only: it makes no network calls and refuses live /
  mainnet outright.** Tasks: `faucet-claim`, `watch-launch`,
  `simulate-snipe`, `balance-check`.
- `src/check-burner-addresses.mjs` — format-checks the known public burner
  addresses (EVM, Solana, Bitcoin SegWit, TRON). Public addresses only.
- `src/chains.mjs` — testnet chain registry (Arc Testnet, Sepolia, Base
  Sepolia, Arbitrum Sepolia, Optimism Sepolia, Amoy, BSC Testnet, Fuji).
  Mainnet chain IDs are blocked by design.
- `skills/on-chain-sniper/` — the skill file for this workflow (see below).

## Install

```bash
git clone https://github.com/0xcavin/on-chain-sniper-tools.git
cd on-chain-sniper-tools
# No dependencies to install. Node >= 18 only.
node --version
```

## Usage (testnet-only)

```bash
npm run check            # syntax-check every script
npm run dry-run          # default dry-run plan (faucet-claim, arc-testnet)
node src/dry-run.mjs --task watch-launch --chain sepolia
node src/dry-run.mjs --task simulate-snipe --chain arc-testnet
node src/dry-run.mjs --task balance-check --chain base-sepolia
npm run check-addresses  # verify burner public-address formats
npm test                 # check + dry-run + address check
```

Anything live or mainnet is refused and exits non-zero:

```bash
node src/dry-run.mjs --live                 # refused
node src/dry-run.mjs --chain ethereum       # refused (not a testnet)
LIVE=true node src/dry-run.mjs              # refused
```

## Rules (DYOR)

1. **Testnet-first, always.** Mainnet is blocked in code, not just in docs.
2. **Dry-run by default.** This package plans; it never submits a transaction.
   A live mode, if ever approved, must be a separate file with its own
   explicit go-ahead — never a flag flip here.
3. **Burner wallet only.** Use the burner addresses for faucets and testnet
   work. Never connect a holding wallet to a test project.
4. **Never paste a seed / mnemonic / private key** anywhere — not in this
   repo, not in chat, not in a form. The burner backup file stays private
   and is never committed (see `.gitignore`).
5. **Verify first.** Team, docs, contract, token details, stated prizes —
   before any task. Unverified = speculation.
6. **Circle Agent Wallets (Arc):** the Circle CLI claim is the route for
   Arc Testnet test USDC (20 test USDC / ~2h, rate limits apply). Terms
   acceptance and email OTP are Cavin's alone — never automated, never shared.
7. **Verify on the explorer.** A claim or transfer is only done when its tx
   hash shows on the testnet explorer (e.g. testnet.arcscan.app for Arc).

## Testnet chains

| Chain | Chain ID | Faucet / notes |
| --- | --- | --- |
| Arc Testnet | 5042002 | Circle faucet — 20 test USDC / ~2h (CLI: `circle` agent wallets) |
| Ethereum Sepolia | 11155111 | Chainlink / ethereum.org Sepolia faucets |
| Base Sepolia | 84532 | Base docs get-funds / CDP faucet |
| Arbitrum Sepolia | 421614 | Chainlink faucet |
| Optimism Sepolia | 11155420 | Chainlink faucet |
| Polygon Amoy | 80002 | Polygon docs faucet |
| BNB Smart Chain Testnet | 97 | Chainlink faucet |
| Avalanche Fuji | 43113 | Chainlink faucet |

Always verify chain ID and RPC on [chainlist.org](https://chainlist.org)
before use. Other burner faucet routes: Solana devnet
(faucet.solana.com), BTC Testnet4, TRON Nile — burner address only.

## Burner wallet (public addresses only)

| Chain | Public address |
| --- | --- |
| EVM (all chains) | `0x6a18969EB94600138bbc70E1E3f1F38BCDa28aD8` |
| Solana | `CYjU7mQMZc3MnbziyfRLdvrhxpHQSvfQA6rMQu86SmRn` |
| Bitcoin SegWit | `bc1qnw40xgm2pmqlw23zfehzfamazxx9h0k8qdf835` |
| TRON | `THZZagYxo7vaS4z1NUVoDTBRyEDAoMzntJ` |

Run `npm run check-addresses` to verify these formats. The Circle agent
wallet (`0x59ad23bc3bee93ce5c95354f9d5a449161209c7f`, ARC-TESTNET /
ETH-SEPOLIA) is a separate wallet — do not confuse it with the burner.

## Skill

The workflow skill lives at `skills/on-chain-sniper/SKILL.md` — load it
whenever working on sniper / burner tasks: verify-first, testnet-first,
Circle CLI Arc claim, burner faucet routes, never a holding wallet, never
paste a seed.

## License

MIT — see `LICENSE`.
