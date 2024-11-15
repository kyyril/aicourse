import { signIn } from "@/config/auth";
import { Button } from "./ui/button";

export default function SignInGoogle() {
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
}
