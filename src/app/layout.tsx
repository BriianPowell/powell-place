import type { Metadata } from "next";
import { site } from "@/data/site";
import { icons } from "@/lib/icons";
import "./globals.css";

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
  metadataBase: new URL(site.website.url),
  icons: {
    icon: icons.w95,
  },
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.website.url,
    siteName: site.name,
    type: "profile",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="desktop-backdrop" aria-hidden />
        {children}
      </body>
    </html>
  );
}
