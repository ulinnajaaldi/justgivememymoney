import React from "react";

import { Toaster } from "@/components/ui/sonner";

const Providers: React.FC<
  Readonly<{
    children: React.ReactNode;
  }>
> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};

export default Providers;
