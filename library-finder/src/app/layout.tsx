import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "近くの図書館を探す | Library Finder",
  description:
    "カーリル図書館 API を用いて、現在地や地域から近くの図書館を検索できるサービス。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
