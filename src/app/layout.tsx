'use client'

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "./globals.css";
import { useState } from "react";
import AppSidebar from "@/components/navigation/app-sidebar";
import Theme from "@/providers/theme-provider";
import { ArrowLeftRight } from "lucide-react";

import i18n from './i18n';
import { I18nextProvider } from "react-i18next";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState<boolean>(true);
  
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <title>♨️ eCAFé</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
      <body
        className="antialiased"
      >
        <I18nextProvider i18n={i18n}>
          <SidebarProvider open={open} onOpenChange={(open:boolean) => setOpen(open)}>
            <Theme>
              <AppSidebar />
              <div className="flex items-center h-[2%]">
                <SidebarTrigger className="w-[20px] h-[18px] hover:bg-background focus:outline-none"/>
                <ArrowLeftRight className="mr-1" size="12"/>
              </div>
              <div className="w-svw h-svw rounded-lg">
                {children}
                <Toaster />
                </div>
            </Theme>
          </SidebarProvider>
        </I18nextProvider>
        </body>
    </html>
  );
}
