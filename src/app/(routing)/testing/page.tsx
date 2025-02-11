'use client'

import { Label } from "@radix-ui/react-dropdown-menu";
import EcafeButton from "@/components/ecafe/ecafe-button";
import DbcCalendar from "../dashboard/components/dbc-calendar";
import DbcUserProfile from "../dashboard/components/dbc-user-profile";
import DbcTasks from "../dashboard/components/dbc-tasks";
import { padZero } from "@/lib/utils";

const Test = () => {

  const test = (num: number) => {
    console.log(padZero(num, 5));
  }

  test(1);
  test(56);
  test(789);
  test(1234);
  test(98765);

  const renderComponent = () => {
    return(
      <>
        <div className="w-[100%] h-[97%]">
          <div className="flex items-center h-[40px] space-x-2 border  border-foreground/20 rounded-sm m-1">
            <div className="flex items-center space-x-1 ml-1">
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
      </>
    );
  };

  return (<>{renderComponent()}</>);
}

export default Test;