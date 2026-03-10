import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "";

  // Mask password but show structure
  let maskedUrl = "NOT SET";
  if (dbUrl) {
    try {
      const urlParts = dbUrl.match(/^(mongodb\+srv:\/\/)([^:]+):([^@]+)@(.+)$/);
      if (urlParts) {
        maskedUrl = `${urlParts[1]}${urlParts[2]}:****@${urlParts[4]}`;
      } else {
        maskedUrl = dbUrl.substring(0, 30) + "... (could not parse)";
      }
    } catch {
      maskedUrl = "SET but unparseable";
    }
  }

  const checks: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL_STRUCTURE: maskedUrl,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "SET" : "NOT SET",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
      REDIS_URL: process.env.REDIS_URL ? "SET" : "NOT SET",
      NODE_ENV: process.env.NODE_ENV || "NOT SET",
    },
  };

  // Test database connection with a fresh client
  const testPrisma = new PrismaClient();
  try {
    await testPrisma.$connect();
    const userCount = await testPrisma.user.count();
    checks.database = {
      status: "CONNECTED",
      userCount,
    };
  } catch (error) {
    checks.database = {
      status: "FAILED",
      error: error instanceof Error ? error.message.substring(0, 300) : String(error),
    };
  } finally {
    await testPrisma.$disconnect();
  }

  return NextResponse.json(checks, { status: 200 });
}
