"use client";

import { createChaptersSchema } from "@/validators/course";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { ListPlus, TrashIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type Props = {};
type Inputtype = z.infer<typeof createChaptersSchema>;
const CreateCourse = (props: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: createChapters, isLoading } = useMutation({
    mutationFn: async ({ title, topics }: Inputtype) => {
      const response = await axios.post("/api/course/createChapters", {
        title,
        topics,
      });
      return response.data;
    },
  });
  const form = useForm<Inputtype>({
    resolver: zodResolver(createChaptersSchema),
    defaultValues: {
      title: "",
      topics: ["", "", ""],
    },
  });

  function onsubmit(data: Inputtype) {
    if (data.topics.some((topic) => topic === "")) {
      toast({
        title: "Error",
        description: "Please fill in all topics",
        variant: "destructive",
      });
    }
    createChapters(data, {
      onSuccess: ({ courseId }) => {
        toast({
          title: "Success",
          description: "Course has been created successfully",
        });
        router.push(`/create/${courseId}`);
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to create course",
          variant: "destructive",
        });
      },
    });
  }

  console.log(form.watch());

  return (
    <div className="w-full mt-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onsubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col items-start w-full sm:items-center sm:flex-row">
                  <FormLabel className="flex-[1] text-xl">Title</FormLabel>
                  <FormControl className="flex-[6]">
                    <Input
                      placeholder="Enter the main topic of the course"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <AnimatePresence>
            {form.watch("topics").map((_, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{
                    opacity: { duration: 0.2 },
                    height: { duration: 0.2 },
                  }}
                >
                  <FormField
                    key={index}
                    control={form.control}
                    name={`topics.${index}`}
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-col items-start w-full sm:items-center sm:flex-row mt-2">
                          <FormLabel className="flex-[1]">
                            Topic {index + 1}
                          </FormLabel>
                          <FormControl className="flex-[6]">
                            <Input
                              placeholder={`Enter subtopic ${
                                index + 1
                              } of the course`}
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  ></FormField>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <div className="flex items-center justify-center mt-4">
            <Separator className="flex-[1]" />
            <div className="mx-4 mt-2">
              <Button
                type="button"
                onClick={() => {
                  form.setValue("topics", [...form.watch("topics"), ""]);
                }}
                variant={"ghost"}
                size={"sm"}
                className=" bg-secondary bg-opacity-50 text-sm"
              >
                <ListPlus className="text-green-500" />
                Add Topics
              </Button>
              <Button
                type="button"
                onClick={() => {
                  form.setValue("topics", [
                    ...form.watch("topics").slice(0, -1),
                  ]);
                }}
                variant={"ghost"}
                className=" bg-secondary bg-opacity-50 ml-2 text-sm"
              >
                <TrashIcon className="text-red-500" />
                Remove
              </Button>
            </div>
          </div>
          <Button disabled={isLoading} type="submit" className="w-full mt-6">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateCourse;
