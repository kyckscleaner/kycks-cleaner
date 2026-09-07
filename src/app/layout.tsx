import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Anton, Bangers, Pacifico } from "next/font/google";
import "./globals.css";
import { PwaRegister } from "@/components/PwaRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const bangers = Bangers({
  variable: "--font-brand-bold",
  weight: "400",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  variable: "--font-brand-script",
  weight: "400",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://kycks-cleaner.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Kycks Cleaner - Nettoyage automobile à domicile",
  description:
    "Kycks Cleaner : nettoyage intérieur et extérieur à domicile sur Granville et ses environs. Réservation en ligne, paiement sur place.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kycks Cleaner",
  },
  icons: {
    icon: "/api/icon/192",
    apple: "/api/icon/180",
  },
  openGraph: {
    title: "Kycks Cleaner - Nettoyage automobile à domicile",
    description: "Nettoyage intérieur et extérieur à domicile sur Granville et ses environs.",
    url: baseUrl,
    siteName: "Kycks Cleaner",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kycks Cleaner - Nettoyage automobile à domicile",
    description: "Nettoyage intérieur et extérieur à domicile sur Granville et ses environs.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} ${bangers.variable} ${pacifico.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
