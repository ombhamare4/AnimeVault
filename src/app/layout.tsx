import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AnimeVault - Discover Your Next Favorite Anime",
  description: "A premium anime discovery platform with stunning visuals. Explore trending, top-rated, and seasonal anime with a Netflix-like experience.",
  keywords: ["Anime", "Manga", "Streaming", "Jikan", "MyAnimeList", "Anime Discovery"],
  authors: [{ name: "AnimeVault Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "AnimeVault - Discover Your Next Favorite Anime",
    description: "A premium anime discovery platform with stunning visuals",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AnimeVault - Discover Your Next Favorite Anime",
    description: "A premium anime discovery platform with stunning visuals",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${inter.variable} font-sans antialiased noise-overlay`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
