import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CatPeace",
  description: "Softening the world with cats.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
