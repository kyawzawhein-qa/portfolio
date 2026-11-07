import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/** Use in admin pages — redirects unauthenticated visitors to login. */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  return session;
}

/** Use in server actions — rejects unauthenticated callers. */
export async function requireAdminAction() {
  const session = await getServerSession(authOptions);
  if (!session) throw new UnauthorizedError();
  return session;
}
