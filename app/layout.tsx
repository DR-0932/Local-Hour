import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/ui/navbar";
import SmoothScroll from "@/lib/smoothscroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({  
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The local hour",
  description: "Anti brain rot social club in sagar where people can meet , talk, jam music, do their own work. Offline community in sagar madhya pradesh hosted in tealogy makronia by Palak Agarwal and Soumya Agarwal",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll>
          {children}
        </SmoothScroll>
        </body>
    </html>
  );
}
