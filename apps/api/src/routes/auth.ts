import { FastifyInstance } from "fastify";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";

const connectWalletSchema = z.object({
  walletAddress: z.string().min(4).max(128),
  chainType: z.enum(["ethereum", "solana", "aptos"]).default("ethereum"),
  displayName: z.string().min(1).max(80).optional(),
  role: z.enum(["user", "producer", "admin"]).optional(),
});

export async function authRoutes(app: FastifyInstance) {
  app.post("/api/auth/connect", async (request, reply) => {
    try {
      const body = connectWalletSchema.parse(request.body);
      const normalizedAddress = body.walletAddress.trim().toLowerCase();

      let [user] = await db
        .select()
        .from(users)
        .where(eq(users.walletAddress, normalizedAddress))
        .limit(1);

      if (!user) {
        [user] = await db
          .insert(users)
          .values({
            walletAddress: normalizedAddress,
            chainType: body.chainType,
            displayName: body.displayName,
            role: body.role ?? "producer",
          })
          .returning();
      } else {
        [user] = await db
          .update(users)
          .set({
            chainType: body.chainType,
            displayName: body.displayName ?? user.displayName,
            role: body.role ?? user.role,
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id))
          .returning();
      }

      return {
        success: true,
        data: {
          userId: user.id,
          walletAddress: user.walletAddress,
          chainType: user.chainType,
          role: user.role,
          displayName: user.displayName,
          avatar: user.avatar,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        message: "Wallet connected",
      };
    } catch (err) {
      if (err instanceof z.ZodError) {
        reply.status(400);
        return { success: false, error: JSON.stringify(err.errors) };
      }

      reply.status(500);
      return { success: false, error: "Failed to connect wallet" };
    }
  });

  app.get("/api/auth/me", async (request, reply) => {
    const walletAddress = request.headers["x-wallet-address"] as string | undefined;

    if (!walletAddress) {
      reply.status(401);
      return { success: false, error: "Missing wallet address" };
    }

    const normalizedAddress = walletAddress.trim().toLowerCase();

    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.walletAddress, normalizedAddress))
        .limit(1);

      if (!user) {
        reply.status(404);
        return { success: false, error: "Wallet not registered" };
      }

      return {
        success: true,
        data: {
          userId: user.id,
          walletAddress: user.walletAddress,
          chainType: user.chainType,
          role: user.role,
          displayName: user.displayName,
          avatar: user.avatar,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
      };
    } catch (err) {
      reply.status(500);
      return { success: false, error: "Failed to fetch wallet session" };
    }
  });
}
