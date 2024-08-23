"use client";

import React from "react";

import { useMediaQuery } from "@/hook/useMediaQuery";
import { useUser } from "@clerk/nextjs";
import { LogOutIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { Drawer } from "vaul";

import Logo from "@/components/icons/Logo";
import NavbarProfileButton from "@/components/layouts/navbar-profile-button";
import { Button } from "@/components/ui/button";

import { NAVIGATION_LIST, ROUTES_PATH } from "@/constants/routes";

import { Avatar, AvatarImage } from "../ui/avatar";

const NavbarDashboard: React.FC = () => {
  const { user } = useUser();
  const isMobile = useMediaQuery("(max-width: 980px)");

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  return (
    <nav className="container fixed left-0 right-0 top-0 z-50 bg-white">
      {isMobile ? (
        <div className="my-3 flex items-center justify-between">
          <Logo className="h-10 w-10" />
          <Drawer.Root
            direction="right"
            open={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
          >
            <Drawer.Trigger asChild>
              <Button variant="outline" size="icon">
                <MenuIcon />
              </Button>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 z-[9999] bg-black/40" />
              <Drawer.Content className="fixed bottom-0 right-0 z-[9999] mt-24 flex h-full w-full flex-col rounded-t-[10px] bg-white lg:w-[400px] lg:bg-transparent">
                <div className="relative m-0 flex h-full flex-1 rounded-l-lg bg-white p-4 md:m-2 lg:rounded-lg">
                  <div className="my-auto mr-2 h-[100px] w-2 rounded-full bg-muted" />
                  <div className="mx-auto w-full">
                    <Drawer.Title className="mb-4 inline-flex w-full items-center gap-2 border-b pb-2 font-medium">
                      <Logo className="h-8 w-8" />{" "}
                      <span className="text-sm">Just Give Me My Money.</span>
                    </Drawer.Title>
                    <Drawer.Description className="sr-only">
                      Drawer content
                    </Drawer.Description>
                    <div className="flex flex-col">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between rounded-md border-b p-3">
                          <span className="text-sm">
                            {user?.fullName as string}
                          </span>
                          <Avatar className="h-7 w-7 object-contain">
                            <AvatarImage
                              src={user?.imageUrl as string}
                              alt={user?.fullName as string}
                            />
                          </Avatar>
                        </div>
                        {NAVIGATION_LIST.map((item, index) => (
                          <Link
                            key={`${item.title}-${index}`}
                            href={item.href}
                            onClick={() => setIsDrawerOpen(false)}
                            className="flex items-center justify-between rounded-md border-b p-3 hover:bg-gray-50"
                          >
                            <span className="text-sm">{item.title}</span>
                            <item.icons className="mr-2 h-5 w-5 text-gray-900" />
                          </Link>
                        ))}
                        <button className="flex items-center justify-between rounded-md border-b border-b-red-500 p-3 hover:bg-gray-50">
                          <span className="text-sm text-red-500">Logout</span>
                          <LogOutIcon className="mr-2 h-5 w-5 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </div>
      ) : (
        <div className="my-2 grid grid-cols-12 items-center">
          <div className="col-span-1 lg:col-span-2">
            <Logo className="h-10 w-10" />
          </div>
          <div className="col-span-9 flex items-center justify-center gap-6 lg:col-span-8">
            {NAVIGATION_LIST.map((item, index) => (
              <div key={`${item.title}-${index}`}>
                <Button
                  size="sm"
                  variant="link"
                  className="my-2 rounded-full"
                  asChild
                >
                  <Link href={item.href}>
                    <item.icons className="mr-2 h-5 w-5" />
                    {item.title}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
          <div className="col-span-2 justify-self-end">
            <NavbarProfileButton
              actionLink={ROUTES_PATH.home}
              actionTitle="Homepage"
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarDashboard;
