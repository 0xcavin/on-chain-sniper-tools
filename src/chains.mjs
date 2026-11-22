// Testnet chain registry — testnets ONLY. Mainnet chain IDs are refused
// everywhere in this package by design.
// Source of chain IDs: chainlist.org (verify before use, testnet-first).
// No network calls, no keys, no funds.

export const TESTNET_CHAINS = Object.freeze({
  "arc-testnet": { chainId: 5042002, name: "Arc Testnet", currency: "USDC (test)" },
  "sepolia": { chainId: 11155111, name: "Ethereum Sepolia", currency: "ETH (test)" },
  "base-sepolia": { chainId: 84532, name: "Base Sepolia", currency: "ETH (test)" },
  "arbitrum-sepolia": { chainId: 421614, name: "Arbitrum Sepolia", currency: "ETH (test)" },
  "optimism-sepolia": { chainId: 11155420, name: "Optimism Sepolia", currency: "ETH (test)" },
  "amoy": { chainId: 80002, name: "Polygon Amoy", currency: "MATIC (test)" },
  "bsc-testnet": { chainId: 97, name: "BNB Smart Chain Testnet", currency: "BNB (test)" },
  "fuji": { chainId: 43113, name: "Avalanche Fuji", currency: "AVAX (test)" },
});

// Mainnet chain IDs that must never be accepted here. If a chain ID is in
// this list (or not in TESTNET_CHAINS at all), the task is refused.
export const BLOCKED_MAINNET_CHAIN_IDS = Object.freeze([
  1, // Ethereum mainnet
  8453, // Base mainnet
  42161, // Arbitrum One
  10, // Optimism mainnet
  137, // Polygon mainnet
  56, // BNB Smart Chain mainnet
  43114, // Avalanche C-Chain mainnet
  5042, // Arc mainnet
]);

export function isTestnetChain(chain) {
  return Object.hasOwn(TESTNET_CHAINS, chain);
}

export function getTestnetChain(chain) {
  if (!isTestnetChain(chain)) {
    throw new Error(
      `Refused: '${chain}' is not an allowed testnet. Allowed: ${Object.keys(TESTNET_CHAINS).join(", ")}. Mainnet is blocked by design.`,
    );
  }
  return TESTNET_CHAINS[chain];
}

export function assertTestnetChainId(chainId) {
  const id = Number(chainId);
  if (BLOCKED_MAINNET_CHAIN_IDS.includes(id)) {
    throw new Error(`Refused: chain ID ${id} is a mainnet chain. Mainnet is blocked by design.`);
  }
  const known = Object.values(TESTNET_CHAINS).some((c) => c.chainId === id);
  if (!known) {
    throw new Error(`Refused: chain ID ${id} is not a known testnet in this package.`);
  }
  return id;
}
