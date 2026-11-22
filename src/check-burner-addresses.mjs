// cavin.muse — burner wallet public-address checker.
// Verifies the FORMAT of the known public burner addresses only.
// No keys, no seed, no network calls, no funds. Public addresses are safe
// to share; the backup file with the seed must never be in this repo.
//
// Usage:
//   node src/check-burner-addresses.mjs
// Exit 0 when every known address passes its format check, else exit 1.
//
// Checks (format only — this does not prove ownership or a balance):
//   EVM    0x + 40 hex chars
//   Solana base58, 32-44 chars
//   BTC    bech32 SegWit, bc1q + 38 chars
//   TRON   T + 33 base58 chars

export const BURNER_ADDRESSES = Object.freeze({
  evm: "0x6a18969EB94600138bbc70E1E3f1F38BCDa28aD8",
  solana: "CYjU7mQMZc3MnbziyfRLdvrhxpHQSvfQA6rMQu86SmRn",
  bitcoin: "bc1qnw40xgm2pmqlw23zfehzfamazxx9h0k8qdf835",
  tron: "THZZagYxo7vaS4z1NUVoDTBRyEDAoMzntJ",
});

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export function isValidEvmAddress(address) {
  return typeof address === "string" && /^0x[0-9a-fA-F]{40}$/.test(address);
}

export function isValidSolanaAddress(address) {
  return (
    typeof address === "string" &&
    address.length >= 32 &&
    address.length <= 44 &&
    [...address].every((c) => BASE58.includes(c))
  );
}

export function isValidBitcoinBech32(address) {
  return typeof address === "string" && /^bc1q[0-9a-z]{38}$/.test(address);
}

export function isValidTronAddress(address) {
  return (
    typeof address === "string" &&
    address.length === 34 &&
    address.startsWith("T") &&
    [...address].every((c) => BASE58.includes(c))
  );
}

const CHECKS = Object.freeze({
  evm: { label: "EVM (all chains)", check: isValidEvmAddress },
  solana: { label: "Solana", check: isValidSolanaAddress },
  bitcoin: { label: "Bitcoin SegWit", check: isValidBitcoinBech32 },
  tron: { label: "TRON", check: isValidTronAddress },
});

export function checkAll(addresses = BURNER_ADDRESSES) {
  return Object.entries(CHECKS).map(([key, { label, check }]) => ({
    chain: key,
    label,
    address: addresses[key],
    ok: check(addresses[key]),
  }));
}

function main() {
  console.log("cavin.muse burner address check — format only, public addresses, no keys");
  const results = checkAll();
  let allOk = true;
  for (const r of results) {
    console.log(`  [${r.ok ? "PASS" : "FAIL"}] ${r.label}: ${r.address}`);
    if (!r.ok) allOk = false;
  }
  if (!allOk) {
    console.error("ERROR: one or more burner addresses failed the format check. Do not use them until re-verified.");
    process.exit(1);
  }
  console.log("All burner public addresses pass format checks.");
  console.log("Note: format is not ownership — verify balances on the explorer, and never share the seed/backup.");
}

main();
