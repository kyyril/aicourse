import SignInGoogle from "@/components/SignGoogle";
import { Button } from "@/components/ui/button";
import { auth, signIn } from "@/config/auth";

export default async function Home() {
  const session = await auth();
  console.log(session?.user);
  return <SignInGoogle />;
}
