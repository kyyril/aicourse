import { prisma } from "@/config/prisma";
import { strict_output } from "@/lib/aimodel/gemini";
import {
  getQuestionFromTranscript,
  getTranscript,
  searchYouTube,
} from "@/lib/youtubeapi";
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
    const videoId = await searchYouTube(chapter.youtubeSearchQuery);
    let transcript = await getTranscript(videoId);
    let maxLength = 500;
    transcript = transcript.split(" ").slice(0, maxLength).join(" ");
    const formatSummary = { summary: "summary of the transcript" };
    const promptSummary: string =
      `you are ai capable of summarising a youtube transcript, summarise in 250 word or less and do not talk of the sponsors or anything unrelated to the main topic, also do not introduce what the summary is about.\n` +
      transcript;
    const outputSummary: any = await strict_output(
      promptSummary,
      formatSummary
    );
    const question = await getQuestionFromTranscript(transcript, chapter.name);
    return NextResponse.json({ videoId, transcript, outputSummary, question });
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
