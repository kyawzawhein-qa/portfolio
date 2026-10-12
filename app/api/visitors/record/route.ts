import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getClientIpFromHeaders } from "@/lib/client-ip";
import { getUniqueVisitorCount, getVisitorCookieName, recordUniqueVisitor } from "@/lib/visitors";

export const dynamic = "force-dynamic";

export async function POST() {
  const cookieStore = cookies();
  const existing = cookieStore.get(getVisitorCookieName());
  const count = await getUniqueVisitorCount();

  if (existing?.value === "1") {
    return NextResponse.json({ count, recorded: false });
  }

  const headerList = headers();
  const ip = getClientIpFromHeaders(headerList) ?? headerList.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = headerList.get("user-agent");

  const result = await recordUniqueVisitor(ip ?? "", userAgent);

  const response = NextResponse.json({
    count: result.ok ? result.count : count,
    recorded: result.ok && result.created
  });

  if (result.ok) {
    response.cookies.set(getVisitorCookieName(), "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 400,
      path: "/"
    });
  }

  return response;
}

export async function GET() {
  const count = await getUniqueVisitorCount();
  return NextResponse.json({ count });
}
