'use client'

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "./globals.css";
import { useState } from "react";
import AppSidebar from "@/components/navigation/app-sidebar";
import Theme from "@/providers/theme-provider";
import { ArrowLeftRight } from "lucide-react";

import i18n from './i18n';
import { I18nextProvider } from "react-i18next";
import { UserProvider } from "@/hooks/use-user";
import { DebugProvider } from "@/hooks/use-debug";
import { Toaster } from "sonner";
import ProgressBar from "./components/progress-bar";

import LogRocket from 'logrocket';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState<boolean>(true);

  // LogRocket.init('j9dl4b/ecafe', {
  //   release: '0.8.0'
  // });

  // LogRocket.identify('999', {
  //   name: 'rwdevops999',
  //   email: 'rwdevops999@gmail.com',
  //   });

  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <title>♨️ eCAFé</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://unpkg.com/favloader@0.4.4"></script>
      </head>
      <body
        className="antialiased"
      >
        <DebugProvider>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <SidebarProvider open={open} onOpenChange={(open:boolean) => setOpen(open)}>
                <Theme>
                <ProgressBar>
                <AppSidebar />
                  <div className="flex items-center h-[2%]">
                    <SidebarTrigger className="w-[20px] h-[18px] hover:bg-background focus:outline-none"/>
                    <ArrowLeftRight className="mr-1" size="12"/>
                  </div>
                  <div className="w-svw h-svw rounded-lg" id="XXX1">
                      {children}
                      <Toaster richColors position="top-center"/>
                  </div>
                  </ProgressBar>
                  </Theme>
              </SidebarProvider>
            </I18nextProvider>
          </UserProvider>
        </DebugProvider>
      </body>
    </html>
  );
}
