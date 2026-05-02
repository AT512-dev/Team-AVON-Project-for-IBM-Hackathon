import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeGuard | Security Audit Dashboard",
  description: "One-click AI-powered security auditing for your codebase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
