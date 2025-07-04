import prisma from "@/utils/db";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const POST = async (request: any) => {
  const { firstname, lastname, email, password, address, phone,apartment,city,country,postalCode,role } = await request.json();

  const existingUser = await prisma.user.findFirst({ where: { email } });

  if (existingUser) {
    return new NextResponse("Email is already in use", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 5);

  try {
    await prisma.user.create({
      data: {
        id: nanoid() + "",
        firstname,
        lastname,
        email,
        password: hashedPassword,
        address,
        phone,
        apartment,
        city,
        country,
        postalCode,
        role,
      },
    });
    return new NextResponse("user is registered", { status: 200 });
  } catch (err: any) {
    return new NextResponse(err, {
      status: 500,
    });
  }
};
