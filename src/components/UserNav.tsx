"use client";

import { User } from "next-auth";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { LogOutIcon } from "lucide-react";
import UserAvatar from "./UserAvatar";

type Props = {
  user: User;
};

const UserNav = ({ user }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant={"link"} size={"icon"}>
          <UserAvatar user={user} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p>{user.name}</p>}
            {user.email && (
              <p className="text-sm text-secondary-foreground truncate">
                {user.email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuItem
          onSelect={() => {
            signOut();
          }}
          className="cursor-pointer"
        >
          Sign out
          <LogOutIcon className="w-4 h-4 ml-2" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
