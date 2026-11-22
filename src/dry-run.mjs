// cavin.muse — on-chain sniper task runner, DRY-RUN ONLY.
// Testnet-first, no dependencies, no network calls, no keys, no funds moved.
// It only prints the exact steps a live run would take, so a plan can be
// reviewed (DYOR) before anything is ever executed.
//
// Usage:
//   node src/dry-run.mjs                          # default plan (faucet-claim, arc-testnet)
//   node src/dry-run.mjs --task watch-launch --chain sepolia
//   node src/dry-run.mjs --task simulate-snipe --chain arc-testnet
//   node src/dry-run.mjs --task balance-check --chain base-sepolia
//
// Refusals (exit 1, nothing planned, nothing sent):
//   --live / LIVE=true / DRY_RUN=false  -> live mode does not exist in this file
//   --chain <mainnet or unknown>        -> only the testnets in src/chains.mjs
//   --task <unknown>                    -> only the tasks listed below
//
// This file makes no network calls by design: no fetch, no http, no sockets.
// A future live mode, if Cavin ever approves one, must be a separate file
// with its own explicit go-ahead — never by flipping a flag here.

import { getTestnetChain, TESTNET_CHAINS } from "./chains.mjs";

const TASKS = Object.freeze({
  "faucet-claim": {
    description: "Claim test funds for the burner wallet from a verified faucet.",
    steps: (chain) => [
      `1. Confirm the target is a testnet: ${chain.name} (chain ID ${chain.chainId}).`,
      "2. Open the verified faucet for this chain (see README.md faucet table) — burner address only, never a holding wallet.",
      "3. Complete the faucet's own check (captcha / login / proof-of-work) by hand — this script cannot do that step.",
      "4. Wait for the faucet tx, then verify the balance on the chain's testnet explorer before treating it as done.",
      "5. Record the tx hash and amount in the run log. No funds move anywhere else.",
    ],
  },
  "watch-launch": {
    description: "Watch a testnet token/NFT launch and record the plan to act on it.",
    steps: (chain) => [
      `1. Confirm the target is a testnet: ${chain.name} (chain ID ${chain.chainId}).`,
      "2. Verify the launch first: team, docs, contract address, token details, stated prizes. No team/docs/token details = pure speculation, do not act.",
      "3. Read the launch contract on the testnet explorer. Never connect a wallet holding anything to an unverified project.",
      "4. Write down the exact entry conditions (price, amount, slippage, deadline) for review — this dry run only plans them.",
      "5. Nothing is submitted. A live entry needs Cavin's explicit go-ahead for that specific launch.",
    ],
  },
  "simulate-snipe": {
    description: "Simulate a snipe (buy/mint) against a testnet launch — planned only, never submitted.",
    steps: (chain) => [
      `1. Confirm the target is a testnet: ${chain.name} (chain ID ${chain.chainId}).`,
      "2. Use test funds only, from the burner wallet, on the testnet. Amounts are test tokens with no real value.",
      "3. Plan the transaction: contract, function, amount, gas, max slippage — print it, do not send it.",
      "4. Check the simulation result (would it revert? would slippage eat it?) and record the answer.",
      "5. Stop here. Submitting the real transaction is a separate, Cavin-approved step — this script never does it.",
    ],
  },
  "balance-check": {
    description: "Check the burner wallet's public balances on a testnet (read-only plan).",
    steps: (chain) => [
      `1. Confirm the target is a testnet: ${chain.name} (chain ID ${chain.chainId}).`,
      "2. Look up the burner public addresses (see src/check-burner-addresses.mjs) on the testnet explorer — public addresses only, no keys.",
      "3. Record balances per chain. Zero is a valid result; it means no faucet claim has landed yet.",
      "4. If a balance is unexpectedly non-zero, verify the tx hash on the explorer before trusting it.",
    ],
  },
});

function parseArgs(argv) {
  const args = { task: "faucet-claim", chain: "arc-testnet", live: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--task" && argv[i + 1]) args.task = argv[++i];
    else if (a.startsWith("--task=")) args.task = a.slice("--task=".length);
    else if (a === "--chain" && argv[i + 1]) args.chain = argv[++i];
    else if (a.startsWith("--chain=")) args.chain = a.slice("--chain=".length);
    else if (a === "--live") args.live = true;
    else if (a === "--help" || a === "-h") {
      console.log("Usage: node src/dry-run.mjs [--task <task>] [--chain <testnet>]");
      console.log(`Tasks: ${Object.keys(TASKS).join(", ")}`);
      console.log(`Testnets: ${Object.keys(TESTNET_CHAINS).join(", ")}`);
      console.log("Dry-run only. There is no live mode in this file.");
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: '${a}'. Use --help for usage.`);
    }
  }
  return args;
}

function main() {
  // Live mode is refused before anything else runs.
  if (process.env.LIVE === "true" || process.env.DRY_RUN === "false") {
    throw new Error("Refused: LIVE=true / DRY_RUN=false. This runner is dry-run only — live mode does not exist here.");
  }
  const args = parseArgs(process.argv.slice(2));
  if (args.live) {
    throw new Error("Refused: --live is not supported. This runner is dry-run only.");
  }
  const chain = getTestnetChain(args.chain); // throws on mainnet / unknown
  const task = TASKS[args.task];
  if (!task) {
    throw new Error(`Refused: unknown task '${args.task}'. Allowed: ${Object.keys(TASKS).join(", ")}.`);
  }

  console.log("cavin.muse sniper dry-run — testnet only, nothing sent, no network calls");
  console.log(`  task: ${args.task} — ${task.description}`);
  console.log(`  chain: ${chain.name} (chain ID ${chain.chainId})`);
  console.log(`  wallet: burner wallet, public addresses only (see src/check-burner-addresses.mjs)`);
  console.log("");
  for (const line of task.steps(chain)) console.log(line);
  console.log("");
  console.log("Dry run complete. Nothing was submitted, no funds moved, no keys used.");
  console.log("Blocked by design: mainnet chains, --live, LIVE=true, DRY_RUN=false.");
}

try {
  main();
} catch (err) {
  console.error(`ERROR: ${err.message}`);
  process.exit(1);
}
