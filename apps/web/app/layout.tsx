import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { cn } from "@workspace/ui/lib/utils";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontSans.variable, "font-mono", jetbrainsMono.variable)}
    >
      <body className="flex flex-col h-svh overflow-hidden">
        <ThemeProvider>
          <Navbar />
          <div className="flex-1 overflow-y-auto">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
