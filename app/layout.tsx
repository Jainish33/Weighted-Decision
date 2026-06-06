import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/context/SessionContext";

export const metadata: Metadata = {
  title: "Idea Quadrant Analyzer",
  description:
    "Evaluate business ideas on an Effort vs Impact 2x2 matrix and find your next move.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
