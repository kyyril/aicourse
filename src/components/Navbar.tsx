import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import ThemeToggler from "./ThemeToggle";
import SignInGoogle from "./SignGoogle";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 max-w-7xl mx-auto px-4 md:px-8 py-3 grid grid-cols-12 items-center outline-none border-none backdrop-blur-sm bg-primary-foreground/0.5">
      <div className="col-span-4 flex text-3xl font-bold">CourseAI</div>
      <div className="col-span-4 flex justify-center space-x-4">
        <Link href={"/home"} className="text-lg">
          Home
        </Link>
        <Link href={"/create"} className="text-lg">
          Create
        </Link>
        <Link href={"/settings"} className="text-lg">
          Settings
        </Link>
      </div>
      <div className="col-span-4 flex justify-end items-center space-x-4">
        <ThemeToggler />
        <SignInGoogle />
      </div>
    </nav>
  );
}
