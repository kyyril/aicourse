import { prisma } from "@/config/prisma";
import { strict_output } from "@/lib/aimodel/gemini";
import { getUnsplashImage } from "@/lib/unplash";
import { createChaptersSchema } from "@/validators/course";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, topics } = createChaptersSchema.parse(body);

    // Tipe untuk data output dari prompt
    type OutputTopicsType = {
      title: string;
      chapters: {
        name: string;
        youtubeSearchQuery: string;
      }[];
    };

    const formatTopic = [
      {
        title: "Topic Title",
        chapters: [
          {
            name: "Chapter Title",
            youtubeSearchQuery: "Search query for relevant YouTube content",
          },
        ],
      },
    ];
    const formatImage = [{ image_search_term: "Relevant image search term" }];

    const promptTopics = `
      You are tasked to create a course titled "${title}". 
      The course consists of several topics: ${topics.join(", ")}.
      If no topics are provided, create 3 default topics automatically.
      For each topic, generate the following:
      - A title.
      - 1 chapter related to the topic.
      Each chapter should include:
      - A name (title of the chapter).
      - A detailed YouTube search query to find relevant educational content.
    `;

    const promptImage = `
      Provide a simple image search term for the course titled "${title}".
      This search term will be used with the Unsplash API.
      Output should be a JSON object like this:
      [{ "image_search_term": "Relevant image search term" }]
    `;

    // Generate course topics and image
    const outputTopics = (await strict_output(
      promptTopics,
      formatTopic
    )) as OutputTopicsType[];
    const outputImageTerm = (await strict_output(
      promptImage,
      formatImage
    )) as any;

    const courseImage = await getUnsplashImage(
      outputImageTerm.image_search_term
    );

    // Create course in the database
    const course = await prisma.course.create({
      data: {
        name: title,
        image: courseImage,
      },
    });

    // Create topics and chapters
    for (const topic of outputTopics) {
      const prismaTopic = await prisma.topic.create({
        data: {
          name: topic.title,
          courseId: course.id,
        },
      });

      await prisma.chapter.createMany({
        data: topic.chapters.map((chapter) => ({
          name: chapter.name,
          youtubeSearchQuery: chapter.youtubeSearchQuery,
          topicId: prismaTopic.id,
        })),
      });
    }

    return NextResponse.json({
      courseId: course.id,
      outputTopics,
      courseImage,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid body", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
