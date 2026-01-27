import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/organisms/Sidebar";
import PlayerBar from "@/components/organisms/PlayerBar";
import { ScrollArea } from "@/components/ui/scroll-area";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lyrifi - Music Streaming",
  description: "Your favorite music, powered by YouTube and MusicBrainz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white h-screen flex flex-col overflow-hidden`}
      >
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 flex flex-col min-w-0 bg-zinc-950">
            <ScrollArea className="h-full">
              <div className="p-8 pb-24">
                {children}
              </div>
            </ScrollArea>
          </main>
        </div>
        <PlayerBar />
      </body>
    </html>
  );
}
