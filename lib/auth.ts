import { PrivyClient } from "@privy-io/server-auth";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const privy = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

/** Returns the DB user for the currently authenticated Privy session, or null. */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("privy-token")?.value;
    if (!token) return null;

    const { userId } = await privy.verifyAuthToken(token);
    return prisma.user.findUnique({ where: { privyId: userId } });
  } catch {
    return null;
  }
}

/** Throws if not authenticated. Use in API routes. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}
