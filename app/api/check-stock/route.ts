import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, quantity } = body;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.quantity < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Stock check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
