"use client";
import { Chapter, Course, Topic } from "@prisma/client";
import React from "react";
import CardChapters from "./CardChapters";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

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
            <h2 className="text-sm text-secondary-foreground/70">
              Topic {topicIndex + 1}
            </h2>
            <h3 className="text-xl font-semibold">{topic.name}</h3>
            <div className="mt-2">
              {topic.chapters.map((chapter, chapterIndex) => {
                return (
                  <CardChapters chapter={chapter} chapterIndex={chapterIndex} />
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="flex items-center justify-center mt-4 ">
        <Separator className="flex-[1]" />
        <div className="flex items-center gap-2 mx-4">
          <Link
            href={"/create"}
            className={buttonVariants({
              variant: "secondary",
            })}
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </Link>
          <Button type="button" onClick={() => {}}>
            Generate
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </div>
        <Separator className="flex-[1]" />
      </div>
    </div>
  );
};

export default ConfirmCreateCourse;
