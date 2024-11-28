"use client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";

import React from "react";

type Props = {
  chapter: Chapter;
  chapterIndex: number;
  completedChapters: Set<String>;
  setCompletedChapters: React.Dispatch<React.SetStateAction<Set<String>>>;
};

export type ChapterCardHandler = {
  triggerLoad: () => void;
};

const CardChapters = React.forwardRef<ChapterCardHandler, Props>(
  ({ chapter, chapterIndex, setCompletedChapters, completedChapters }, ref) => {
    const { toast } = useToast();
    const [success, setSuccess] = React.useState<boolean | null>(null);
    const { mutate: getChapterInfo, isLoading } = useMutation({
      mutationFn: async () => {
        const response = await axios.post("/api/chapter/getInfo", {
          chapterId: chapter.id,
        });
        return response.data;
      },
    });

    const addChaptersIdSet = React.useCallback(() => {
      setCompletedChapters((prev) => {
        const newSet = new Set(prev);
        newSet.add(chapter.id);
        return newSet;
      });
    }, [chapter.id, setCompletedChapters]);

    React.useEffect(() => {
      if (chapter.videoId) {
        setSuccess(true);
        addChaptersIdSet();
      }
    }, [chapter, addChaptersIdSet]);

    React.useImperativeHandle(ref, () => ({
      async triggerLoad() {
        if (chapter.videoId) {
          addChaptersIdSet();
          return;
        }
        getChapterInfo(undefined, {
          onSuccess: () => {
            setSuccess(true);
            addChaptersIdSet();
          },
          onError(error) {
            console.error(error);
            setSuccess(false);
            toast({
              title: "Error",
              description: "Failed to load chapter information",
              variant: "destructive",
            });
            addChaptersIdSet();
          },
        });
      },
    }));
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
        {isLoading && <Loader2 className="animate-spin" />}
      </div>
    );
  }
);

CardChapters.displayName = "CardChapters";
export default CardChapters;
