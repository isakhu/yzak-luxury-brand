import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import FloatingSocialButtons from "@/components/layout/FloatingSocialButtons";
import SessionProvider from "@/components/providers/SessionProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yzak Luxury Brand | Ethiopia's Premier Luxury Destination",
  description:
    "Gold jewelry, diamonds, clothes, shoes, watches, handbags and accessories. Hawassa & Dire Dawa, Ethiopia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <SessionProvider>
        {children}
        </SessionProvider>
        <FloatingSocialButtons />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1C2235",
              color: "#F5F0E8",
              border: "1px solid #C9A84C",
            },
          }}
        />
      </body>
    </html>
  );
}
