import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";

const APP_NAME = "Aura Health AI";
const APP_DESCRIPTION =
  "Personalized AI-driven health and wellness plans. Get custom diet and workout routines tailored to your needs with Aura Health AI.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
    // startupImage: [], // Can be added later if startup images are available
  },
  formatDetection: {
    telephone: false,
  },
  authors: [
    { name: "Ashutosh Swamy", url: "https://github.com/ashutoshswamy" },
  ],
  creator: "Ashutosh Swamy",
  publisher: "Aura Health AI",
  keywords: [
    "AI fitness",
    "personalized diet",
    "workout plan",
    "health app",
    "Gemini AI",
    "fitness coach",
    "nutrition",
    "wellness",
    "Aura Health",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_NAME,
      template: `%s | ${APP_NAME}`,
    },
    description: APP_DESCRIPTION,
    images: [
      // Add a default social sharing image if available
      {
        url: "https://i.ibb.co/r2bVj8MJ/Aura-Health-AI-Social-Image.png",
        width: 1200,
        height: 630,
        alt: "Aura Health AI Social Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: APP_NAME,
      template: `%s | ${APP_NAME}`,
    },
    description: APP_DESCRIPTION,
    images: ["https://i.ibb.co/r2bVj8MJ/Aura-Health-AI-Social-Image.png"], // Add a Twitter-specific image if available
    creator: "@ashutoshswamy_", // Your Twitter handle
  },
};

export const viewport: Viewport = {
  themeColor: "#26C6DA", // Matches primary color
  // width: 'device-width', // Already default but can be explicit
  // initialScale: 1, // Already default
  // maximumScale: 1, // Optional: good for accessibility, prevents unwanted zoom on PWA-like apps
  // userScalable: false, // Optional: use with caution, can hinder accessibility
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="icon.png"
          type="image/<generated>"
          sizes="<generated>"
        />
        <link
          rel="apple-touch-icon"
          href="apple-icon.png"
          type="image/<generated>"
          sizes="<generated>"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
