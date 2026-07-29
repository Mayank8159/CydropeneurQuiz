import type { Metadata, Viewport } from "next";
import { ScanlineOverlay } from "@/components/ui/scanline-overlay";
import { PwaInstallPrompt } from "@/components/ui/pwa-install-prompt";
import "./globals.css";

export const metadata: Metadata = {
  title: "CYDROPRENEUR | Quiz Arena",
  description: "Real-time cyberpunk quiz platform for college events",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cydropreneur",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#00f3ff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="msapplication-TileColor" content="#08090d" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body
        className="text-ice-white min-h-dvh font-body antialiased"
      >
        <ScanlineOverlay />
        <PwaInstallPrompt />
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    console.log('SW registered:', reg.scope);
                  }).catch(function(err) {
                    console.log('SW registration failed:', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
