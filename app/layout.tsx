import { Toaster } from "sonner";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Inter } from "next/font/google";
import { ConvexCLientProvider } from "@/components/providers/convex-provider";

const inter = Inter({subsets:['latin']})


export const metadata: Metadata = {
  title: "Jotion",
  description: "The connected workspace where better, faster work happens.",
  icons:{
    icon: [
      {
        media: "(prefers-color-theme: light)",
        url: "/logo.svg",
        href: "/logo.svg",
      },
      {
        media: "(prefers-color-theme: dark)",
        url: "/logo-dark.svg",
        href: "/logo-dark.svg",
      }
    ]}
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={inter.className}
      >
        <ConvexCLientProvider>
        <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="jotion-theme">
          <Toaster position="bottom-center"/>
          {children}
        </ThemeProvider>
        </ConvexCLientProvider>
      </body>
    </html>
  );
}
