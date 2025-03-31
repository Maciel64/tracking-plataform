import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClientProvider, QueryProvider } from "@/providers/client-provider";
import { ThemeProvider } from "@/providers/theme-provider";
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
  title: "Raster: A melhor solução para rastreio de veículos",
  description: "Locazação e rastreio de veículos gerenciados por você",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <QueryProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider 
           attribute="class" 
           defaultTheme="system"
           enableSystem
           value={{
             light: "light",
             dark: "dark"
            }}
          
          >
            {children}
            <ClientProvider />
          </ThemeProvider>
        </body>
      </QueryProvider>
    </html>
  );
}
