import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/app/_components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/app/providers";
import { Toaster } from "sonner";
import { ConsoleMessage } from "@/app/_components/console-message";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "< Portfolio | Ruan Bueno />",
  description: "Essa descrição com certeza não deve aparecer na tela do navegador, mas se aparecer, dá um visu aqui",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* DNS prefetch e preconnect para melhor performance */}
        <link rel="dns-prefetch" href="//api.screenshotone.com" />
        <link rel="preconnect" href="https://api.screenshotone.com" crossOrigin="" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="//vercel.app" />
        <link rel="dns-prefetch" href="//netlify.app" />
        <link rel="dns-prefetch" href="//allpines.com.br" />
        
        {/* Preload de recursos críticos */}
        <link rel="preload" href="/logo.png" as="image" type="image/png" />
        <link rel="preload" href="/Foto_Perfil.jpg" as="image" type="image/jpeg" />
      </head>
      <body className={inter.className}>
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
