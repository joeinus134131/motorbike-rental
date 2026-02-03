import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const motorbike = await prisma.motorbike.findUnique({
      where: { id: params.id },
    });

    if (!motorbike) {
      return NextResponse.json({ message: "Unit not found" }, { status: 404 });
    }

    return NextResponse.json(motorbike);
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, brand, model, year, pricePerDay, imageUrl, description, status } = body;

    const motorbike = await prisma.motorbike.update({
      where: { id: params.id },
      data: {
        name,
        brand,
        model,
        year,
        pricePerDay,
        imageUrl,
        description,
        status,
      },
    });

    return NextResponse.json(motorbike);
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await prisma.motorbike.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Unit deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
