import { Providers } from "@/components/shared/providers";
import { SITE } from "@/lib/constants";
import "./globals.css";
export const metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: {
        default: `${SITE.name} — ${SITE.tagline}`,
        template: `%s | ${SITE.name}`,
    },
    description: SITE.description,
    keywords: ["fashion", "ecommerce", "BERA", "clothing", "Bangladesh", "online shopping"],
    openGraph: {
        title: `${SITE.name} — Modern elegance`,
        description: SITE.description,
        type: "website",
        siteName: SITE.name,
    },
    robots: { index: true, follow: true },
};
export const viewport = {
    themeColor: "#7a1f3d",
    width: "device-width",
    initialScale: 1,
};
export default function RootLayout({ children }) {
    return (<html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- root layout is global in App Router */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@500;600;700;800&display=swap" rel="stylesheet"/>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>);
}
