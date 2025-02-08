'use client'

import { useUser } from "@/hooks/use-user";
import { UserType } from "@/types/ecafe";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const loggedInUser: UserType = {
  name: "Welter",
  firstname: "Rudi",
  email: "rudi.welter@gmail.com",
  password: "123456",
  phone:"471611256",
  roles: [{
    name: "Role1",
    description: "role1",
    id: 5,
    managed: false
  }]
}

export default function Home() {
  const {setUser} = useUser();
  const {t} = useTranslation();

  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    console.log("SETTING USER");
    setUser(loggedInUser);
    setIsClient(true);
  }, []);

  return (
    <div>{isClient ? t('title') : "Welcome by eCAFé"}</div>
  );
}
