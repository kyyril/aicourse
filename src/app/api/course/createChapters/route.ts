import { strict_output } from "@/lib/aimodel/gemini";
import { createChaptersSchema } from "@/validators/course";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, topics } = createChaptersSchema.parse(body);

    const formatTopic = [
      {
        title: "Title of the topics",
        chapters: [
          {
            chapter_title: "Title of the chapter",
            youtube_search_query: "Search query for relevant YouTube",
          },
        ],
      },
    ];
    const formatImage = { image_search_term: "good relevant image" };

    const promptTopics = `
      You are tasked to create a course titled "${title}". 
      The course consists of several topics: ${topics.join(", ")}.
      if there is no topic then create a topic automatically which is 3 topics only.
      For each topic, generate the following:
      1. A brief description of the topic.
      2. Generate 3 chapters related to the topic. 
         Each chapter should have:
           - A title.
           - A detailed YouTube search query to find relevant educational content.
    `;
    const promptImage = ` provide simple image search term for the title of a course about ${title}. 
    This search will be fed into the Unsplash API. The output should be a JSON object with the following structure:;`;

    // Generate course content
    const outputTopics = await strict_output(promptTopics, formatTopic);

    const output_Image = await strict_output(promptImage, formatImage);

    return NextResponse.json({ outputTopics, output_Image });
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
