import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./styles/blackmail-theme.css";
import logo from "../public/logo_Nav.png";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BlackMail - Temporary Email Service",
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
        <link rel="icon" href={logo.src} type="image/png" />
      </head>
      <body
        className={`${inter.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
