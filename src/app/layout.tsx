import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClientProvider, QueryProvider } from "@/providers/client-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Raster | Dashboard",
  description: "Locazação e rastreio de veículos gerenciados por você",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <QueryProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <ClientProvider />
        </body>
      </QueryProvider>
    </html>
  );
}
