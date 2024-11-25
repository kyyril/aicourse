import { prisma } from "@/config/prisma";
import { NextResponse } from "next/server";
import z from "zod";

const bodyParser = z.object({
  chapterId: z.string(),
});
export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { chapterId } = bodyParser.parse(body);
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
    });
    if (!chapter) {
      return NextResponse.json(
        { success: false, error: "chapter not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "invalid body",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: "unknow" },
        { status: 500 }
      );
    }
  }
}
