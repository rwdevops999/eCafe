'use client'

import EcafeButton from "@/components/ecafe/ecafe-button";
import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { flushAll, handleClearDB, initDB } from "@/lib/db";
import DbcTasks from "./components/dbc-tasks";
import DbcCalendar from "./components/dbc-calendar";
import DbcUserProfile from "./components/dbc-user-profile";
import { User, UserMinus, UserPlus } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { testUser } from "./data/test-user";
import { useDebug } from "@/hooks/use-debug";
import { ConsoleLogger } from "@/lib/console.logger";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const {login, logout} = useUser();
  const {debug} = useDebug();

  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  const databaseCleared = () => {
    logger.debug("Dashboard", "Database cleared");
  }

  const setTestUser = () => {
    login(testUser);
  }

  const clearTestUser = () => {
    logout();
  }

  return (
    <>
        <PageBreadCrumbs crumbs={[{name: "ecafé", url: "/"}, {name: "dashboard"}]} />
      {/* <div className="bg-red-500 w-[100%] h-[97%]"> */}
      <div className="w-[100%] h-[97%]">
        {debug && <div className="flex items-center h-[40px] space-x-2 border  border-foreground/20 rounded-sm m-1">
          <div className="flex items-center space-x-1 ml-1">
            <UserPlus width={16} height={16} onClick={setTestUser}/>
            <UserMinus width={16} height={16} onClick={clearTestUser}/>
          </div>
        </div>}
        <div className="grid grid-cols-12">
          <div className="col-span-3">
            <DbcCalendar className="mx-1 flex justify-center rounded-md border-foreground/20"/>
            <DbcUserProfile className="mx-1 mt-1 rounded-md border border-foreground/20"/>
          </div>
          <DbcTasks className="h-[65%] col-span-9 rounded-md border border-foreground/20"/>
        </div>
      </div>
    </>
  )
}

export default Dashboard;