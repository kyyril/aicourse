import axios from "axios";
import { YoutubeTranscript } from "youtube-transcript";
import { strict_output } from "./aimodel/gemini";

export async function searchYouTube(searchQuery: string) {
  searchQuery = encodeURIComponent(searchQuery);
  console.count("youtube search");
  const { data } = await axios.get(
    `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&q=${searchQuery}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=5`
  );

  if (!data) {
    console.log("youtube fail");
    return null;
  }
  if (data.items[0] == undefined) {
    console.log("youtube fail");
    return null;
  }
  return data.items[0].id.videoId;
}

export async function getTranscript(videoId: string) {
  try {
    let transcript_arr = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: "en",
    });
    let transcript = "";
    for (let t of transcript_arr) {
      transcript += t.text + " ";
    }

    return transcript.replaceAll("\n", "");
  } catch (error) {
    return "";
  }
}

export async function getQuestionFromTranscript(
  transcript: string,
  course_title: string
) {
  const formatQuestion = {
    question: "question",
    answer: "answer with max length of 15 words",
    option1: "option 1",
    option2: "option 2",
    option3: "option 3",
  };
  const promtGetQuestion = `you are a helpul AI that is able to generate mcq questions and answer, the length of each answer should not be more than 15 word.
  you are to generate a random hard mcq question about ${course_title}, with context of the following transcript: ${transcript}`;
  const ouputQuestion: any = await strict_output(
    promtGetQuestion,
    formatQuestion
  );
  return ouputQuestion;
}
