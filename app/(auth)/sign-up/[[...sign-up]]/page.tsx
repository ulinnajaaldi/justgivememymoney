import React from "react";

import { Metadata } from "next";

import SignUpFeature from "@/features/Auth/SignUp";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Sign up for a new account to access your dashboard and manage your Money.",
};

const SignUpPage: React.FC = () => {
  return <SignUpFeature />;
};

export default SignUpPage;
