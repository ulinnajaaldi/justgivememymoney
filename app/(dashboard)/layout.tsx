import React from "react";

import NavbarDashboard from "@/components/layouts/navbar-dashboard";
import { ScrollArea } from "@/components/ui/scroll-area";

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
