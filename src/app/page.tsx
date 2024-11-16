import SignInGoogle from "@/components/SignGoogle";
import { Button } from "@/components/ui/button";
import { auth } from "@/config/auth";
import Image from "next/image";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return <SignInGoogle />;
  }
  return (
    <div>
      <h1>your login</h1>
      <div>{session.user?.name}</div>
    </div>
  );
}
