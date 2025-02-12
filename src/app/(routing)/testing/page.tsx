'use client'

import { Label } from "@radix-ui/react-dropdown-menu";
import EcafeButton from "@/components/ecafe/ecafe-button";
import DbcCalendar from "../dashboard/components/dbc-calendar";
import DbcUserProfile from "../dashboard/components/dbc-user-profile";
import DbcTasks from "../dashboard/components/dbc-tasks";
import { decrypt, padZero } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ExtendedUserType, UserType } from "@/types/ecafe";
import { useUser } from "@/hooks/use-user";
import { handleUpdateUser } from "@/lib/db";

const Test = () => {
  const {login} = useUser();

  const testUser: UserType = {
      id:1,
      name:"Test",
      firstname:"test",
      phone:"",
      email:"rwdevops999@gmail.com",
      password:"",
      passwordless:true,
      attemps:0,
      createDate:new Date(),
      blocked:false
  }

  const setAnUser = () => {
    login(testUser);
  }

  const u: ExtendedUserType = {
    id:2,
    name:"New",
    firstname:"user",
    email:"test@test.com",
    password:"27X11x49",
    passwordless: false,
    phone:"",
    attemps:1,
    blocked:true
  }

  const test = () => {
    handleUpdateUser(u, ()=>{});
  }
  
  const renderComponent = () => {
    return(
        <div className="w-[100%] h-[97%]">
          <div className="flex items-center h-[40px] space-x-2 border  border-foreground/20 rounded-sm m-1">
            <div className="flex items-center space-x-1 ml-1">
              <Button onClick={setAnUser}>User</Button>
              <Label>Database:</Label>
              <EcafeButton caption="Clear Database" />
              <EcafeButton caption="Initialize Database" />
              <EcafeButton caption="Setup Countries" />
              <Button onClick={test}>Test</Button>
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div className="col-span-3">
              <DbcCalendar className="mx-1 flex justify-center rounded-md border-foreground/20"/>
              <DbcUserProfile className="mx-1 mt-1 rounded-md border border-foreground/20"/>
            </div>
            <DbcTasks className="h-[65%] col-span-9 rounded-md border border-foreground/20"/>
          </div>
        </div>
    );
  };

  return (<>{renderComponent()}</>);
}

export default Test;