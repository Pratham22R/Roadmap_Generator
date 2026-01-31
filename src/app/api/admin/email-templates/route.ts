import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { auth } from "@/auth"; // Assuming auth is set up here

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = getPrisma();
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json({ error: "Template name is required" }, { status: 400 });
    }

    const template = await prisma.emailTemplate.findUnique({
      where: { name },
    });

    // If not found, return null (client will use default)
    return NextResponse.json({ template });
  } catch (error) {
    console.error("Error fetching email template:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = getPrisma();
    const body = await req.json();
    const { name, content, subject, description } = body;

    if (!name || !content) {
      return NextResponse.json({ error: "Name and content are required" }, { status: 400 });
    }

    const template = await prisma.emailTemplate.upsert({
      where: { name },
      update: {
        content,
        subject,
        description,
        updatedAt: new Date(),
      },
      create: {
        name,
        content,
        subject,
        description,
      },
    });

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Error saving email template:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
