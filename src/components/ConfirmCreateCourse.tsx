import { Chapter, Course, Topic } from "@prisma/client";
import React from "react";

type Props = {
  course: Course & {
    topics: (Topic & {
      chapters: Chapter[];
    })[];
  };
};

const ConfirmCreateCourse = ({ course }: Props) => {
  return (
    <div className="w-full mt-4">
      {course.topics.map((topic, topicIndex) => {
        return (
          <div key={topicIndex} className="mt-4">
            <h2 className="text-sm uppercase text-secondary-foreground">
              Topic {topicIndex + 1}
            </h2>
            <h3 className="text-xl font-semibold">{topic.name}</h3>
            <div className="mt-2">
              {topic.chapters.map((chapter, chapterIndex) => {
                return (
                  <div key={chapterIndex}>
                    <p className="text-secondary-foreground/60">
                      Chapter {chapterIndex + 1}: {chapter.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConfirmCreateCourse;
