import CreateCourse from "@/components/CreateCourse";
import { auth } from "@/config/auth";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

type Props = {};

const CreatePage = async (props: Props) => {
  const session = await auth();
  if (!session?.user) {
    return redirect("/");
  }
  return (
    <div className="flex flex-col items-start max-w-xl px-8 mx-auto my-10">
      <h1 className="self-center text-3xl font-bold text-center sm:text-xl">
        Create Course
      </h1>
      <div className="flex p-3 mt-5 border-none bg-secondary rounded-md">
        <InfoIcon className="w-12 h-12 m-3" />
        <p>
          Input a course title or subject you want to learn and list the topics
          you'd like covered. AI will create a personalized course for you!
        </p>
      </div>
      <CreateCourse />
    </div>
  );
};

export default CreatePage;
