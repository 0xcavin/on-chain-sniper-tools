# on-chain-sniper

## Name

on-chain-sniper

## Description

Testnet-first workflow for on-chain sniper tasks and the multi-chain burner
wallet: verify a project for legitimacy, plan the task as a dry run, claim
test funds from verified faucets (Circle CLI for Arc Testnet test USDC),
and check burner balances — without ever touching mainnet, real funds, a
holding wallet, or any seed / private key. Use when Cavin asks to snipe,
watch, or test a token/NFT launch, claim a testnet faucet, check burner
balances, or set up sniper tooling. Do not use for mainnet trading, real
funds, or anything that needs a holding wallet.

## When to use

- Cavin asks about a sniper task, a launch to watch, or a token/NFT to test
- Claiming testnet faucets for the burner wallet (Arc, Sepolia, Base Sepolia,
  Arbitrum Sepolia, Optimism Sepolia, Amoy, BSC testnet, Fuji, Solana devnet,
  BTC Testnet4, TRON Nile)
- Checking burner wallet balances or public addresses
- Working in the `on-chain-sniper-tools` repo or the package in
  `~/workspace/crypto/on-chain-sniper-tools-package/`
- Airdrop / testnet work from @airdropfind that involves an on-chain task

## When NOT to use

- Mainnet, real funds, or moving anything of real value — refuse and say so
- Connecting a holding wallet to any project — refuse and say so
- Anything asking for a seed, mnemonic, or private key — refuse, never paste
  or request one
- Accepting Circle Terms or using Cavin's email / OTP — those are Cavin's
  alone, never automated

## Rules (hard, in order)

1. **Verify first.** Team, docs, contract address, token details, stated
   prizes. No team / docs / token details / stated prizes = pure
   speculation: report it as such, do not act, never connect a wallet
   holding anything.
2. **Testnet-first, always.** Only the testnets in `src/chains.mjs`
   (Arc Testnet 5042002, Sepolia 11155111, Base Sepolia 84532, Arbitrum
   Sepolia 421614, Optimism Sepolia 11155420, Amoy 80002, BSC testnet 97,
   Fuji 43113). Mainnet chain IDs are blocked in code. Verify chain ID and
   RPC on chainlist.org before use.
3. **Dry-run by default.** Run `npm run dry-run` / `node src/dry-run.mjs`
   first and show Cavin the plan. The runner makes no network calls and
   refuses `--live`, `LIVE=true`, and `DRY_RUN=false`. A live step needs
   Cavin's explicit go-ahead for that specific action — never a flag flip.
4. **Burner wallet only.** Faucets and testnet work use the burner public
   addresses only (see below). The Circle agent wallet
   (`0x59ad23bc3bee93ce5c95354f9d5a449161209c7f`) is separate — do not
   confuse the two.
5. **Never paste a seed.** No seed, mnemonic, or private key in chat, in
   files, in forms, or in the repo. The burner backup file is private and
   never committed. If a step asks for one, stop and tell Cavin.
6. **Verify on the explorer.** A claim or transfer is only done when its tx
   hash shows on the testnet explorer (Arc: testnet.arcscan.app).

## Steps

### 1. Verify the project

- Find the team, docs, contract address, token details, and stated prizes
  from the project's own sources — not from a random repost.
- If any of those are missing, label the project speculation and stop.
- Record the sources (URLs) with the finding.

### 2. Plan it as a dry run

```bash
cd ~/workspace/crypto/on-chain-sniper-tools-package
npm run check
node src/dry-run.mjs --task <faucet-claim|watch-launch|simulate-snipe|balance-check> --chain <testnet>
```

- Show Cavin the printed plan before doing anything else.
- `watch-launch` / `simulate-snipe` only plan the entry (contract, amount,
  slippage, deadline). Nothing is submitted.

### 3. Claim test funds (Circle CLI, Arc Testnet)

Circle Agent Wallets is the route for Arc Testnet test USDC — 20 test USDC
per claim, roughly every 2h, rate limits apply (429s have persisted well
past the stated window before; a 429 means wait, not retry harder).

- Circle CLI alone for the Circle claim — no web faucet, no address paste.
- Terms acceptance + email OTP are Cavin's alone. Never accept Terms or use
  his email / OTP.
- Claim to the burner EVM address on Arc Testnet; verify the tx hash on
  testnet.arcscan.app.

### 4. Burner faucet routes (other chains)

Use the verified faucet list, burner address only, never a holding wallet:

- EVM testnets (Sepolia, Base Sepolia, Arbitrum Sepolia, Optimism Sepolia,
  Amoy, BSC testnet, Fuji): Chainlink faucets, Base docs get-funds / CDP,
  Polygon docs faucet, ethereum.org Sepolia docs.
- Solana devnet: faucet.solana.com.
- BTC Testnet4, TRON Nile: their official testnet faucets.
- Most of these need Cavin's clicks (captcha / login / proof-of-work) —
  name the manual step instead of pretending it is automated.
- Avoid faucet aggregators with no team/docs; treat them as unverified.

### 5. Check the burner addresses and balances

```bash
npm run check-addresses   # format-check the public addresses
node src/dry-run.mjs --task balance-check --chain <testnet>
```

- Public addresses only:

  | Chain | Public address |
  | --- | --- |
  | EVM (all chains) | `0x6a18969EB94600138bbc70E1E3f1F38BCDa28aD8` |
  | Solana | `CYjU7mQMZc3MnbziyfRLdvrhxpHQSvfQA6rMQu86SmRn` |
  | Bitcoin SegWit | `bc1qnw40xgm2pmqlw23zfehzfamazxx9h0k8qdf835` |
  | TRON | `THZZagYxo7vaS4z1NUVoDTBRyEDAoMzntJ` |

- Zero is a valid balance — it means no claim has landed yet. Verify any
  non-zero balance against the explorer tx hash.

### 6. Report

Report: what was verified (with sources), the dry-run plan, what landed
(tx hash + explorer link) or what is still blocked and whose step it is
(Cavin's click / OTP / Terms, or a faucet rate limit). Never report a
seed, key, OTP, or Terms acceptance as done by the agent.

## Reference

- Repo: https://github.com/0xcavin/on-chain-sniper-tools
- Burner wallet repo: https://github.com/0xcavin/multi-chain-burner-wallet
- Site: https://0xcavin.github.io
- Chain IDs / RPCs: https://chainlist.org (verify first)
- Circle faucet: https://faucet.circle.com (Arc Testnet, CLI route preferred)
- Arc testnet explorer: https://testnet.arcscan.app
- Motto: DYOR, don't trust — verify. Not your keys, not your coins.
