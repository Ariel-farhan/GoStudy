import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { darkMode: true, language: true },
    });

    return NextResponse.json({
      darkMode: user?.darkMode ?? true,
      language: user?.language ?? "id",
    });
  } catch (err) {
    console.error("Theme GET error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(body.darkMode !== undefined && { darkMode: body.darkMode }),
        ...(body.language !== undefined && { language: body.language }),
      },
    });

    return NextResponse.json({ success: true, ...body });
  } catch (err) {
    console.error("Theme PATCH error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}