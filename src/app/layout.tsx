import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/providers/ToastProvider";
import StoreProvider from "@/providers/StoreProvider";
import AuthGuard from "@/components/global/AuthGuard";

export const metadata: Metadata = {
  title: "Fivee Business",
  description: "Fivee Business",
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Global toast provider */}
      <ToastProvider />

      <body className={`antialiased`}>
        <StoreProvider>
          <AuthGuard>{children}</AuthGuard>
        </StoreProvider>
      </body>
    </html>
  );
}
