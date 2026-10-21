import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

const VISITOR_COOKIE = "kzh_visitor";

export function getVisitorCookieName() {
  return VISITOR_COOKIE;
}

export function hashVisitorIp(ip: string, salt: string): string {
  return createHash("sha256").update(`${ip}:${salt}`, "utf8").digest("hex");
}

export async function getUniqueVisitorCount(): Promise<number> {
  try {
    return await prisma.uniqueVisitor.count();
  } catch {
    return 0;
  }
}

export type RecordVisitorResult =
  | { ok: true; created: boolean; count: number }
  | { ok: false; reason: "missing_salt" | "missing_ip" | "bot" | "error" };

export async function recordUniqueVisitor(ip: string, userAgent: string | null): Promise<RecordVisitorResult> {
  const salt = process.env.VISITOR_HASH_SALT;
  if (!salt) {
    return { ok: false, reason: "missing_salt" };
  }

  const { isLikelyBot } = await import("@/lib/bot-detect");
  if (isLikelyBot(userAgent)) {
    return { ok: false, reason: "bot" };
  }

  if (!ip) {
    return { ok: false, reason: "missing_ip" };
  }

  try {
    const ipHash = hashVisitorIp(ip, salt);
    let created = false;
    try {
      await prisma.uniqueVisitor.create({ data: { ipHash } });
      created = true;
    } catch (error: unknown) {
      const code = typeof error === "object" && error && "code" in error ? (error as { code: string }).code : "";
      if (code !== "P2002") {
        throw error;
      }
    }
    const count = await prisma.uniqueVisitor.count();
    return { ok: true, created, count };
  } catch {
    return { ok: false, reason: "error" };
  }
}
