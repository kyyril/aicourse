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
    let maxLength = 250;
    transcript = transcript.split(" ").slice(0, maxLength).join(" ");

    const { summary }: { summary: string } = await strict_output(
      `you are ai capable of summarising a youtube transcript, summarise in 250 word or less and do not talk of the sponsors or anything unrelated to the main topic, also do not introduce what the summary is about. and follow format: { summary: "summary of the transcript" }.\n` +
        transcript,
      { summary: "summary of the transcript" }
    );

    const questions = await getQuestionFromTranscript(transcript, chapter.name);

    await prisma.question.createMany({
      data: questions.map((question: any) => {
        let options = [
          question.answer,
          question.option1,
          question.option2,
          question.option3,
        ];
        options = options.sort(() => Math.random() - 0.5);
        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          chapterId: chapterId,
        };
      }),
    });

    await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        videoId: videoId,
        summary: summary,
      },
    });

    return NextResponse.json({
      // chapterId: chapter.id,
      success: true,
      videoId,
      summary,
      questions,
    });
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
