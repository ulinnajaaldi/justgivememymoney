"use client";

import React from "react";

import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";

import Logo from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";

import { ROUTES_PATH } from "@/constants/routes";

const HomepageFeature: React.FC = () => {
  const { isSignedIn } = useAuth();

  return (
    <>
      <nav className="container my-4 flex items-center justify-between">
        <Logo className="h-8 w-8" />
        <div>
          {isSignedIn ? (
            <UserButton showName />
          ) : (
            <Button size="sm" className="rounded-full" asChild>
              <Link href={ROUTES_PATH.auth.signIn}>Sign in</Link>
            </Button>
          )}
        </div>
      </nav>
      <main className="container flex h-[90vh] items-center justify-center">
        <h1 className="text-2xl font-bold md:text-4xl lg:text-7xl">
          Just Give Me My Money
        </h1>
      </main>
    </>
  );
};

export default HomepageFeature;
