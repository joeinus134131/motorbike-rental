import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const systemConfig = await prisma.systemConfig.findFirst();
  
  // Dummy payment simulation
  // In a real app, this would integrate with Midtrans/Stripe
  const booking = await prisma.booking.update({
    where: { id: params.id },
    data: {
      status: "PAID",
      paymentId: `DUMMY-PAY-${Math.random().toString(36).substring(7).toUpperCase()}`,
    },
  });

  return NextResponse.json({
    message: "Payment successful",
    booking,
    instructions: systemConfig?.paymentInstructions,
  });
}
