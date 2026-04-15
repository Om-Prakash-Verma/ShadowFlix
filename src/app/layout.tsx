import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";

import { AdScripts } from "@/components/ad-scripts";
import { JsonLd } from "@/components/json-ld";
import { SiteTextAnimator } from "@/components/site-text-animator";
import { SiteHeader } from "@/components/site-header";
import { DockNavigation } from "@/components/dock-navigation";
import { baseMetadata, organizationSchema, websiteSchema } from "@/lib/seo";

import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["600", "700", "800", "900"] });

export const metadata: Metadata = baseMetadata();

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} h-full bg-black antialiased`}>
      <body className="min-h-full bg-black text-white">
        <JsonLd data={websiteSchema()} />
        <JsonLd data={organizationSchema()} />
        <SiteTextAnimator />
        <SiteHeader />
        {children}
        <DockNavigation />
        <AdScripts />
      </body>
    </html>
  );
}
