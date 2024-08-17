import React from "react";

import { ClerkLoaded, ClerkLoading, SignUp } from "@clerk/nextjs";
import { Loader } from "lucide-react";

import Logo from "@/components/icons/Logo";

import { ROUTES_PATH } from "@/constants/routes";

const SignUpFeature: React.FC = () => {
  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="hidden items-center justify-center bg-neutral-300 lg:flex">
        <Logo className="h-32 w-32 text-primary-foreground" />
      </div>
      <div className="flex h-full flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold lg:text-4xl">Hello there!</h1>
          <p className="text-base text-foreground lg:text-lg">
            Let&apos;s get started with the app!
          </p>
        </div>
        <div>
          <ClerkLoaded>
            <SignUp path={ROUTES_PATH.auth.signUp} />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader className="animate-spin text-muted-foreground" />
          </ClerkLoading>
        </div>
      </div>
    </main>
  );
};

export default SignUpFeature;
