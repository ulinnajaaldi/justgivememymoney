import React from "react";

import { Viewport } from "next";

import NavbarDashboard from "@/components/layouts/navbar-dashboard";
import { ScrollArea } from "@/components/ui/scroll-area";

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavbarDashboard />
      <ScrollArea className="mt-[7vh] h-[92.5vh] max-h-[93vh]">
        {children}
      </ScrollArea>
    </>
  );
}
