'use client'

import { useDebug } from "@/hooks/use-debug";
import { stringToBoolean } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";


export default function Home() {
  const { setDebug } = useDebug()

  const {t} = useTranslation();

  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    const strDebug: string|undefined = process.env.NEXT_PUBLIC_DEBUG;
    let debug: boolean = false;

    if (strDebug) {
      debug = stringToBoolean(strDebug);
    }

    setIsClient(true);

    console.log("HOME: DEBUG = " + debug);
    setDebug(debug);
  }, []);

  return (
      <>
        <div className="w-[100%] h-[100%]">
            <div className="h-screen flex items-center justify-center">
              <img className="border border-foreground/50 rounded-lg p-2" src="/images/ecafe.png" width={750} height={665} />
            </div>
        </div>
      </>
  );
}
