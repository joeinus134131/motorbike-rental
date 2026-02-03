import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await prisma.landingPageConfig.findFirst();
  return NextResponse.json(config);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const config = await prisma.landingPageConfig.upsert({
    where: { id: "default" },
    update: data,
    create: { ...data, id: "default" },
  });

  return NextResponse.json(config);
}
