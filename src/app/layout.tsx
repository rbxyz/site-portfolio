import "@/styles/globals.css";
import { Inter, Anton, Space_Grotesk, Space_Mono } from "next/font/google";
import { ThemeProvider } from "@/app/_components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/app/providers";
import { Toaster } from "sonner";
import { ConsoleMessage } from "@/app/_components/console-message";

const inter = Inter({ subsets: ["latin"] });

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono-sp",
  display: "swap",
});

export const metadata = {
  title: "< Portfolio | Ruan Bueno />",
  description:
    "Essa descrição com certeza não deve aparecer na tela do navegador, mas se aparecer, dá um visu aqui",
  icons: {
    icon: "/logo.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* DNS prefetch e preconnect para melhor performance */}
        <link rel="dns-prefetch" href="//api.screenshotone.com" />
        <link
          rel="preconnect"
          href="https://api.screenshotone.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="//vercel.app" />
        <link rel="dns-prefetch" href="//netlify.app" />
        <link rel="dns-prefetch" href="//allpines.com.br" />

        {/* Preload de recursos críticos */}
        <link rel="preload" href="/logo.png" as="image" type="image/png" />
        <link rel="preload" href="/ruan.png" as="image" type="image/jpeg" />
      </head>
      <body
        className={`${inter.className} ${anton.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </Providers>
        <Analytics />
        <Toaster position="top-right" richColors />
        <ConsoleMessage />
      </body>
    </html>
  );
}
