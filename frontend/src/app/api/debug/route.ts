import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const checks: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? "SET (starts with: " + process.env.DATABASE_URL.substring(0, 20) + "...)" : "NOT SET",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "SET" : "NOT SET",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
      REDIS_URL: process.env.REDIS_URL ? "SET" : "NOT SET",
      NODE_ENV: process.env.NODE_ENV || "NOT SET",
    },
  };

  // Test database connection
  try {
    const userCount = await prisma.user.count();
    checks.database = {
      status: "CONNECTED",
      userCount,
    };
  } catch (error) {
    checks.database = {
      status: "FAILED",
      error: error instanceof Error ? error.message : String(error),
    };
  }

  return NextResponse.json(checks, { status: 200 });
}
