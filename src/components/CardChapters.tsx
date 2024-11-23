"use client";
import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";

import React from "react";

type Props = {
  chapter: Chapter;
  chapterIndex: number;
};

const CardChapters = ({ chapter, chapterIndex }: Props) => {
  const [success, setSuccess] = React.useState<boolean | null>(null);
  return (
    <div
      key={chapter.id}
      className={cn("px-4 py-2 mt-2 rounded flex justify-between", {
        "bg-secondary": success === null,
        "bg-red-500/80": success === false,
        "bg-green-500/80": success === true,
      })}
    >
      <p className="text-secondary-foreground">
        Chapter {chapterIndex + 1}: {chapter.name}
      </p>
    </div>
  );
};

export default CardChapters;
