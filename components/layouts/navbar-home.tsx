"use client";

import React from "react";

import { useAuth, useUser } from "@clerk/nextjs";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";

import Logo from "@/components/icons/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ROUTES_PATH } from "@/constants/routes";

const NavbarHome: React.FC = () => {
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  return (
    <nav className="container my-2 flex items-center justify-between">
      <Logo className="h-8 w-8" />
      <div>
        {isSignedIn ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-2 outline-none">
                  <p className="text-sm font-medium">{user?.fullName}</p>
                  <Avatar className="h-8 w-8 object-contain">
                    <AvatarImage
                      src={user?.imageUrl as string}
                      alt={user?.fullName as string}
                    />
                    <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div>
                  <DropdownMenuLabel className="flex flex-col">
                    <span>{user?.fullName}</span>
                    <span className="text-sm text-foreground">
                      {user?.primaryEmailAddress?.emailAddress}
                    </span>
                  </DropdownMenuLabel>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={ROUTES_PATH.dashboard.home}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button
                    className="flex w-full cursor-pointer items-center justify-between"
                    onClick={() => signOut()}
                  >
                    <span>Logout</span>
                    <LogOutIcon className="h-5 w-5" />
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button size="sm" className="rounded-full" asChild>
            <Link href={ROUTES_PATH.auth.signIn}>Sign in</Link>
          </Button>
        )}
      </div>
    </nav>
  );
};

export default NavbarHome;
