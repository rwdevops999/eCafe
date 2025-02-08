'use client'

import { useUser } from "@/hooks/use-user";
import LoginLogout from "./login-logout"

const Test = () => {
  const {user} = useUser();

  if (user.roles) {
    console.log("ROLE: " + user.roles[0].name);
  }
  
  const renderComponent = () => {
    return(
      <>
        USER: {user.name}
        <LoginLogout />
      </>
    );
  };

  return (<>{renderComponent()}</>);
}

export default Test;