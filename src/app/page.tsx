'use client'

import { useUser } from "@/hooks/use-user";
import { UserType } from "@/types/ecafe";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Home() {
  const {t} = useTranslation();

  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>{isClient ? t('title') : "Welcome by eCAFé"}</div>
  );
}
