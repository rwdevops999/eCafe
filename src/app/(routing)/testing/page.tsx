'use client'

import NotificationDialog from "@/components/ecafe/notification-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { serviceUUID } from "@/lib/utils";
import { NotificationButtonsType, UserType } from "@/types/ecafe";
import { JSX, ReactElement, useState } from "react";

const Test = () => {
  const { user, setUser } = useUser();

  const _user: UserType = {
    name: "Welter",
    firstname: "Rudi",
    email: "rudi.welter@gmail.com",
    password: "27X11x49",
    attemps: 0,
    blocked: false,
    phone: "471611256"
  }

  const setTheUser = () => {
    setUser(_user);
  }

  const clearTheUser = () => {
    setUser(undefined);
  }

  const logTheUser = () => {
    console.log("USER = ", user);
  }

  const renderComponent = () => {
    return(
      <>
        <Button onClick={setTheUser}>Set User</Button>
        <Button onClick={clearTheUser}>Clear User</Button>
        <Button onClick={logTheUser}>Show User</Button>
      </>
    );
  };

  return (<>{renderComponent()}</>);
}

export default Test;