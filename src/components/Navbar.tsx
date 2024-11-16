import Link from "next/link";
import ThemeToggler from "./ThemeToggle";
import SignInGoogle from "./SignGoogle";
import { auth } from "@/config/auth";
import UserNav from "./UserNav";

export default async function Navigation() {
  const session = await auth();
  return (
    <nav className="sticky top-0 z-50 max-w-7xl mx-auto px-4 md:px-8 py-3 grid grid-cols-12 items-center outline-none border-none backdrop-blur-sm bg-primary-foreground/0.5">
      <div className="col-span-4 flex text-3xl font-bold">CourseAI</div>
      <div className="col-span-4 flex justify-center space-x-4">
        {session?.user && (
          <>
            <Link href={"/home"} className="text-lg">
              Home
            </Link>
            <Link href={"/create"} className="text-lg">
              Create
            </Link>
            <Link href={"/settings"} className="text-lg">
              Settings
            </Link>
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
