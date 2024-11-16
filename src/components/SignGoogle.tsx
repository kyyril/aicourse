import { signIn } from "@/config/auth";
import { Button } from "./ui/button";

type Props = {};
const SignInGoogle = ({}: Props) => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <Button type="submit">signIn</Button>
    </form>
  );
};

export default SignInGoogle;
