"use client";

import React from "react";

import { useAuth, useUser } from "@clerk/nextjs";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";
import { Url } from "url";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useMediaQuery } from "@/hook/useMediaQuery";

interface NavbarProfileButtonProps {
  actionLink: Url | string;
  actionTitle: string;
}

const NavbarProfileButton: React.FC<NavbarProfileButtonProps> = ({
  actionLink,
  actionTitle,
}) => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [open, setOpen] = React.useState(false);

  if (isDesktop) {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger>
          <div className="flex items-center gap-2 p-2 outline-none">
            <p className="text-sm font-medium">{user?.fullName}</p>
            <Avatar className="h-8 w-8 object-contain">
              <AvatarImage
                src={user?.imageUrl as string}
                alt={user?.fullName as string}
              />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
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
            <Link href={actionLink}>{actionTitle}</Link>
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
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground>
      <DrawerTrigger>
        <div className="flex items-center gap-2 p-2 outline-none">
          <p className="text-sm font-medium">{user?.fullName}</p>
          <Avatar className="h-8 w-8 object-contain">
            <AvatarImage
              src={user?.imageUrl as string}
              alt={user?.fullName as string}
            />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
        <DrawerHeader className="text-left">
          <DrawerTitle>{user?.fullName}</DrawerTitle>
          <DrawerDescription>
            {user?.primaryEmailAddress?.emailAddress}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          <Button variant="outline" asChild>
            <Link href={actionLink}>{actionTitle}</Link>
          </Button>
          <Button variant="outline" onClick={() => signOut()}>
            <p className="text-red-500">Logout</p>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default NavbarProfileButton;
