import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, brand, model, year, pricePerDay, imageUrl, description, status } = body;

    const bike = await prisma.motorbike.create({
      data: {
        name,
        brand,
        model,
        year: parseInt(year.toString()),
        pricePerDay: parseInt(pricePerDay.toString()),
        imageUrl,
        description,
        status,
      },
    });

    return NextResponse.json(bike, { status: 201 });
  } catch (error) {
    console.error("ADMIN_MOTORBIKE_POST_ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const bikes = await prisma.motorbike.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bikes);
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
