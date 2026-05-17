import {
  Horizon,
  Networks,
  Asset,
  Keypair,
  TransactionBuilder,
  Operation,
  BASE_FEE,
} from "@stellar/stellar-sdk";

const IS_TESTNET = process.env.NEXT_PUBLIC_STELLAR_NETWORK !== "mainnet";

export const STELLAR_NETWORK = IS_TESTNET ? Networks.TESTNET : Networks.PUBLIC;
export const HORIZON_URL = IS_TESTNET
  ? "https://horizon-testnet.stellar.org"
  : "https://horizon.stellar.org";

export const server = new Horizon.Server(HORIZON_URL);

// USDC asset on Stellar
export const USDC = IS_TESTNET
  ? new Asset("USDC", "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5") // testnet USDC issuer
  : new Asset("USDC", "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN"); // mainnet Circle USDC

/**
 * Get USDC balance for a Stellar address.
 */
export async function getUsdcBalance(address: string): Promise<number> {
  try {
    const account = await server.loadAccount(address);
    const usdcBalance = account.balances.find(
      (b) =>
        b.asset_type === "credit_alphanum4" &&
        (b as { asset_code: string; asset_issuer: string }).asset_code === USDC.getCode() &&
        (b as { asset_code: string; asset_issuer: string }).asset_issuer === USDC.getIssuer()
    );
    return usdcBalance ? parseFloat(usdcBalance.balance) : 0;
  } catch {
    return 0;
  }
}

/**
 * Send USDC from the platform wallet to a destination address.
 * Used for forwarding payments to freelancer wallets.
 */
export async function sendUsdc(
  destinationAddress: string,
  amountUsdc: string
): Promise<string> {
  const platformSecret = process.env.STELLAR_PLATFORM_WALLET_SECRET!;
  const sourceKeypair = Keypair.fromSecret(platformSecret);
  const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

  const tx = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: STELLAR_NETWORK,
  })
    .addOperation(
      Operation.payment({
        destination: destinationAddress,
        asset: USDC,
        amount: amountUsdc,
      })
    )
    .setTimeout(30)
    .build();

  tx.sign(sourceKeypair);
  const result = await server.submitTransaction(tx);
  return result.hash;
}

/**
 * Verify a Stellar payment transaction.
 * Returns the USDC amount received if valid, null otherwise.
 */
export async function verifyPayment(
  txHash: string,
  expectedDestination: string,
  expectedAmountUsd: number
): Promise<{ valid: boolean; amount: number }> {
  try {
    const tx = await server.transactions().transaction(txHash).call();
    const ops = await tx.operations();

    for (const op of ops.records) {
      if (
        op.type === "payment" &&
        (op as { to: string; asset_code?: string; amount: string }).to === expectedDestination &&
        (op as { asset_code?: string }).asset_code === USDC.getCode()
      ) {
        const amount = parseFloat((op as { amount: string }).amount);
        // Allow 1% tolerance for fees
        if (amount >= expectedAmountUsd * 0.99) {
          return { valid: true, amount };
        }
      }
    }
    return { valid: false, amount: 0 };
  } catch {
    return { valid: false, amount: 0 };
  }
}
