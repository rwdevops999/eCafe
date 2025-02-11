'use client'

import { Label } from "@radix-ui/react-dropdown-menu";
import EcafeButton from "@/components/ecafe/ecafe-button";
import DbcCalendar from "../dashboard/components/dbc-calendar";
import DbcUserProfile from "../dashboard/components/dbc-user-profile";
import {useUser} from "@/hooks/use-user";
import { UserType } from "@/types/ecafe";
import { Button } from "@/components/ui/button";

const _user: UserType = {
  name: "Welter",
  firstname: "Rudi",
  email: "rudi.welter@gmail.com",
  password: "",
  phone: "471611256",
  attemps: 0,
  blocked: true,
  createDate: new Date(),
  address: {
    id: 0,
    street: "Suikerpotstraat",
    number: "6",
    box: "3",
    city: "Diest",
    postalcode: "3290",
    county: "",
    country: {
      id: 0,
      code: "BE",
      name: "Belgium",
      dialCode: "+32",
    }
  }
}

const Test = () => {
  const{ setUser } = useUser();

  const setTestUser = () => {
    setUser(_user);
  }

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
          </div>
        </div>
        <Button onClick={setTestUser}>Set User</Button>
      </>
    );
  };

  return (<>{renderComponent()}</>);
}

export default Test;