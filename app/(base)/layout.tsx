import React from "react";

import NavbarHome from "@/components/layouts/navbar-home";

export default function BaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavbarHome />
      {children}
    </>
  );
}
