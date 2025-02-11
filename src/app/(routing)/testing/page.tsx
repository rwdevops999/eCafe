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

  const [avatar, setAvatar] = useState<ReactElement>(<img />);

  const getAvatar = () => {
    let image: ReactElement;

    image = <img src="https://ui-avatars.com/api/?name=rwdevops@gmail.com&size=32&background=00FF00&color=FF0000&rounded=true" />;

    setAvatar(image);
  }

  const renderComponent = () => {
    return(
      <>
        <Button onClick={getAvatar}>Avatar</Button>
        <Button onClick={setTheUser}>Set User</Button>
        <Button onClick={clearTheUser}>Clear User</Button>
        <Button onClick={logTheUser}>Show User</Button>
        {avatar}
        {/* <Avatar>
          <AvatarImage src={avatar} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar> */}
      </>
    );
  };

  return (<>{renderComponent()}</>);
}

export default Test;