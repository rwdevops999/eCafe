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
import Task from "./task";
import { useState } from "react";
import TaskDialog from "./task-dialog";

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

  const [open, setOpen] = useState<boolean>(false);

  const handleDialogOpen = () => {
    setOpen((oldOpen: boolean) => ! oldOpen);
  }

  const handleDialogClose = () => {
    setOpen(false);
  }

  const renderComponent = () => {
    console.log("TEST");

    return (
      <div>
        <Button onClick = {handleDialogOpen}>open dialog</Button>
        <TaskDialog _taskId={20} _open={open} handleDialogClose={handleDialogClose}/>
      </div>
    );
  };

  return (<>{renderComponent()}</>);
}

export default Test;