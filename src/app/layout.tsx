import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css"; 
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import localFont from 'next/font/local';

const inter = localFont({
  src: [
    { path: '../public/fonts/Inter-Regular.woff2', weight: '400' },
    { path: '../public/fonts/Inter-Bold.woff2', weight: '700' },
  ],
  variable: '--font-inter',
});

const robotoMono = localFont({
  src: [
    { path: '../public/fonts/RobotoMono-Regular.woff2', weight: '400' },
    { path: '../public/fonts/RobotoMono-Bold.woff2', weight: '700' },
  ],
  variable: '--font-roboto-mono',
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
