import ConfirmCreateCourse from "@/components/ConfirmCreateCourse";
import { auth } from "@/config/auth";
import { prisma } from "@/config/prisma";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

type Props = {
  params: {
    courseId: string;
  };
};

const createChapters = async ({ params: { courseId } }: Props) => {
  const session = await auth();
  if (!session?.user) {
    return redirect("/");
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      topics: {
        include: {
          chapters: true,
        },
      },
    },
  });

  if (!course) {
    return redirect("/create");
  }
  return (
    <div className="flex flex-col items-start max-w-xl mx-auto my-16 min-h-screen">
      <h4 className="text-sm uppercase text-secondary-foreground">
        Course Name
      </h4>
      <h1 className="text-5xl font-semibold">{course.name}</h1>
      <div className="flex p-3 mt-5 border-none bg-secondary rounded-md">
        <InfoIcon className="w-6 h-6 m-3" />
        <p>
          Your course is about '{course.name}'. If it looks good, we’ll create
          it for you. If not, you can cancel and make changes.
        </p>
      </div>
      <div>
        <ConfirmCreateCourse course={course} />
      </div>
    </div>
  );
};

export default createChapters;
