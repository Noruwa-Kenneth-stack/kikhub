import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css"; 
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

// Google Fonts
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amin Dashboard - KIKHUB",
  description: "Amin Dashboard - KIKHUB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className="font-inter antialiased">
        <Toaster />
         <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
        <AuthProvider>
          {children}
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
