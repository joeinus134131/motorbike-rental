import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { motorbikeId, startDate, endDate, totalPrice } = await req.json();

  const booking = await prisma.booking.create({
    data: {
      userId: session.user.id,
      motorbikeId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalPrice,
      status: "PENDING",
    },
  });

  return NextResponse.json(booking);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    where: {
      userId: session.user.role === "ADMIN" ? undefined : session.user.id,
    },
    include: {
      motorbike: true,
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookings);
}
