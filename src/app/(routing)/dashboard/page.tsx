'use client'

import EcafeButton from "@/components/ecafe/ecafe-button";
import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { initDB } from "@/lib/db";

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
        <div className="flex items-center h-[10%] w-svw bg-blue-400 space-x-2">
          <Label>Database:</Label>
          <EcafeButton caption="Initialize Database" clickHandler={initializeDB} />
          <EcafeButton caption="Setup Countries" clickHandler={provisionCountries} />
        </div>
        <div>
          <Skeleton className="h-[150px] w-[30%] bg-green-400">Tasks</Skeleton>
        </div>
      </div>
    </>
  )
}

export default Dashboard;