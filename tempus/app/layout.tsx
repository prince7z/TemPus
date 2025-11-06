import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./components/styles.css";
import { ThemeProvider } from "./components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TempusMail : MailService",
  description: "Fast and secure disposable temporary email service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/tempusmail.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${inter.className} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
