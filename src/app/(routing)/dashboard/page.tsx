'use client'

import EcafeButton from "@/components/ecafe/ecafe-button";
import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { handleClearDB, initDB } from "@/lib/db";
import DbcTasks from "./components/dbc-tasks";
import DbcCalendar from "./components/dbc-calendar";
import DbcUserProfile from "./components/dbc-user-profile";

const Dashboard = () => {
  const databaseCleared = () => {
    console.log("Database cleared");
  }

  const clearDB = () => {
    handleClearDB(databaseCleared);
  };

  const initializeDB = () => {
    initDB('*');
  };

  const provisionCountries = () => {
    initDB('country');
  };

  return (
    <>
      <PageBreadCrumbs crumbs={[{name: "dashboard"}]} />
      {/* <div className="bg-red-500 w-[100%] h-[97%]"> */}
      <div className="w-[100%] h-[97%]">
        <div className="flex items-center h-[40px] space-x-2 border  border-foreground/20 rounded-sm m-1">
          <div className="flex items-center space-x-1 ml-1">
            <Label>Database:</Label>
            <EcafeButton caption="Clear Database" clickHandler={clearDB} />
            <EcafeButton caption="Initialize Database" clickHandler={initializeDB} />
            <EcafeButton caption="Setup Countries" clickHandler={provisionCountries} />
          </div>
        </div>
        <div className="grid grid-cols-12">
          <div className="col-span-3">
            <DbcCalendar className="mx-1 flex justify-center rounded-md border-foreground/20"/>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard;