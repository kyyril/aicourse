import Link from "next/link";
import ThemeToggler from "./ThemeToggle";
import SignInGoogle from "./SignGoogle";
import { auth } from "@/config/auth";
import UserNav from "./UserNav";

export default async function Navigation() {
  const session = await auth();
  return (
    <nav className="sticky top-0 z-50 max-w-7xl mx-auto px-4 md:px-8 py-2 grid grid-cols-12 items-center outline-none border-none bg-primary-foreground/0.5 backdrop-blur-lg">
      <div className="col-span-4 flex text-2xl font-bold">CourseAI</div>
      <div className="col-span-4 flex justify-center space-x-4">
        {session?.user && (
          <>
            <Link href={"/"}>Home</Link>
            <Link href={"/create"}>Create</Link>
            <Link href={"/settings"}>Settings</Link>
          </>
        )}
      </div>
      <div className="col-span-4 flex justify-end items-center space-x-4">
        <ThemeToggler />
        {session?.user ? <UserNav user={session.user} /> : <SignInGoogle />}
      </div>
    </nav>
  );
}
