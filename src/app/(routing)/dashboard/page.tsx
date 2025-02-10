'use client'

import EcafeButton from "@/components/ecafe/ecafe-button";
import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { initDB } from "@/lib/db";
import DbcTasks from "./components/dbc-tasks";
import DbcCalendar from "./components/dbc-calendar";
import DbcUserProfile from "./components/dbc-user-profile";

const Dashboard = () => {
  const initializeDB = () => {
    initDB('*');
  };

  const provisionCountries = () => {
    initDB('country');
  };

  return (
    <>
      <PageBreadCrumbs crumbs={[{name: "dashboard"}]} />
      <div className="bg-red-500 w-svw h-svh">
        <div className="flex items-center h-[40px] w-svw bg-blue-400 space-x-2">
          <Label>Database:</Label>
          <EcafeButton caption="Initialize Database" clickHandler={initializeDB} />
          <EcafeButton caption="Setup Countries" clickHandler={provisionCountries} />
        </div>
        <div className="grid grid-cols-10">
          <div className="col-span-10">
            <DbcTasks />
          </div>
          <div className="space-y-4 col-span-4">
            <div>
              <DbcCalendar />
            </div>
            <div>
            </div>
            <div>
              DIV31
            </div>
          </div>
          <div className="space-y-4 col-span-6">
            <div>
              <DbcUserProfile />
            </div>
            <div>
              DIV22
            </div>
            <div>
              DIV32
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard;