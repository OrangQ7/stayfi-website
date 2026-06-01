import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StayFi Protocol",
  description:
    "Tokenizing seasonal hospitality revenue into compliant on-chain assets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
