import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/app/_components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Portfolio",
  description: "My professional portfolio",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
