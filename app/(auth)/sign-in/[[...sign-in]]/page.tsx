import React from "react";

import { Metadata } from "next";

import SignInFeature from "@/features/Auth/SignIn";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your account to access your dashboard and manage your Money.",
};

const SignInPage: React.FC = () => {
  return <SignInFeature />;
};

export default SignInPage;
