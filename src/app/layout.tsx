import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, JetBrains_Mono } from "next/font/google";
import PwaRegister from '@/components/shared/PwaRegister';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CapitalS — Student Financial Operating System",
  description: "A student-first financial OS built for Indian college students and young adults without fixed salaries. Track income, budget, manage EMIs, and split expenses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Material Symbols Outlined for compatibility with mockup HTML items */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${inter.variable} ${geistSans.variable} ${jetbrainsMono.variable} font-sans bg-black text-[#e5e2e1] antialiased min-h-screen flex flex-col relative`}
      >
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
