import type { Metadata } from "next";
import { Fraunces, Inter, Great_Vibes } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// The calligraphy voice of the printed card ("Happy Birthday", "Favourite
// Memories") — used sparingly, only where the physical product speaks.
const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Heart Strings — Some feelings need a song",
  description:
    "A handcrafted gift: a hardcover card, an original song written from your memories, and a personal page they will keep forever.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${greatVibes.variable}`}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
