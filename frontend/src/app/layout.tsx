import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "./auth/context";
import Footer from "./footer";
import "./globals.css";
import { ToastProvider } from "./toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TickEasy – Your Event, Our Responsibility",
  description: "Easily create, manage, and attend events with TickEasy.",
  openGraph: {
    title: "TickEasy – Your Event, Our Responsibility",
    description: "Easily create, manage, and attend events with TickEasy.",
    url: "https://event-grid-2-0.vercel.app/",
    siteName: "TickEasy",
    images: [
      {
        url: "/tickeasy_logo_svg.svg",
        width: 1200,
        height: 630,
        alt: "TickEasy Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TickEasy – Your Event, Our Responsibility",
    description: "Easily create, manage, and attend events with TickEasy.",
    images: ["/tickeasy_logo_svg.svg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
