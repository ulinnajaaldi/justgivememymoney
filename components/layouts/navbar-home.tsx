"use client";

import React from "react";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

import Logo from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";

import { ROUTES_PATH } from "@/constants/routes";

import NavbarProfileButton from "./navbar-profile-button";

const NavbarHome: React.FC = () => {
  const { isSignedIn } = useAuth();
  return (
    <nav className="custom-container my-2 flex items-center justify-between">
      <Logo className="h-10 w-10" />
      <div>
        {isSignedIn ? (
          <NavbarProfileButton
            actionLink={ROUTES_PATH.dashboard.overview}
            actionTitle="Dashboard"
          />
        ) : (
          <Button size="sm" className="my-2 rounded-full" asChild>
            <Link href={ROUTES_PATH.auth.signIn}>Sign in</Link>
          </Button>
        )}
      </div>
    </nav>
  );
};

export default NavbarHome;
