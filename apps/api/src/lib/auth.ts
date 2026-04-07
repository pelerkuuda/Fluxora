import { FastifyRequest } from "fastify";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";

export async function getRequestUser(request: FastifyRequest) {
  const walletAddress = request.headers["x-wallet-address"] as string | undefined;

  if (!walletAddress) {
    return null;
  }

  const normalizedAddress = walletAddress.trim().toLowerCase();
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.walletAddress, normalizedAddress))
    .limit(1);

  return user ?? null;
}
