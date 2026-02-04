import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await prisma.landingPageConfig.findFirst();
  return NextResponse.json(config || {});
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    // Ensure we're updating the single config record or creating if it doesn't exist
    // We use a fixed ID "default" or update the first found record
    const existing = await prisma.landingPageConfig.findFirst();

    if (existing) {
      const updated = await prisma.landingPageConfig.update({
        where: { id: existing.id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
      return NextResponse.json(updated);
    } else {
      const created = await prisma.landingPageConfig.create({
        data: {
          id: "default",
          ...data,
        },
      });
      return NextResponse.json(created);
    }
  } catch (error) {
    console.error("Error updating CMS config:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
