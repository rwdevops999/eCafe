'use client'

import { Label } from "@radix-ui/react-dropdown-menu";
import EcafeButton from "@/components/ecafe/ecafe-button";
import DbcCalendar from "../dashboard/components/dbc-calendar";
import DbcUserProfile from "../dashboard/components/dbc-user-profile";
import DbcTasks from "../dashboard/components/dbc-tasks";
import { decrypt, padZero } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserType } from "@/types/ecafe";
import { useUser } from "@/hooks/use-user";

const Test = () => {
  const {login} = useUser();

  const testUser: UserType = {
    name: "test",
    firstname: "test",
    email: "test@example.com",
    phone: "",
    attemps: 0,
    blocked: false,
    password: ""
  }

  const setAnUser = () => {
    login(testUser);
  }

  const {push} = useRouter();

  const gotoTaskPage = () => {
    push("/task");
  }

  const getEnv = () => {
    console.log("ENV", process.env.DEBUG);
  }

  const test = () => {
    console.log(decrypt("7591ede799388623680aa8ae37ce095f60bad84341dbffd2af237862941c0542"));
  }

  test();

  const renderComponent = () => {
    return(
        <div className="w-[100%] h-[97%]">
          <div className="flex items-center h-[40px] space-x-2 border  border-foreground/20 rounded-sm m-1">
            <div className="flex items-center space-x-1 ml-1">
              <Button onClick={getEnv}>ENV</Button>
              <Label>Database:</Label>
              <EcafeButton caption="Clear Database" />
              <EcafeButton caption="Initialize Database" />
              <EcafeButton caption="Setup Countries" />
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