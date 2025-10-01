import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";

import Providers from "@/components/layouts/providers";

// @ts-ignore
import "./globals.css";

const publicSans = Public_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Just Give Me My Money",
    default: "Just Give Me My Money",
  },
  description: "Its your money, you should have it. LOL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${publicSans.className} antialiased`}>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
