import type { Metadata } from "next";
import { Story_Script, Kiwi_Maru } from "next/font/google";
import "./globals.css";

const storyScript = Story_Script({
  variable: "--font-story-script",
  subsets: ["latin"],
  weight: "400",
});

const kiwiMaru = Kiwi_Maru({
  variable: "--font-kiwi-maru",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Suzuki Shion's Portfolio",
  description: "Suzuki Shion's Portfolio",
  icons: {
    icon: [
      { url: "/shion.svg", type: "image/svg+xml" },
      { url: "/shion.svg", type: "image/svg+xml", sizes: "any" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${storyScript.variable} ${kiwiMaru.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
