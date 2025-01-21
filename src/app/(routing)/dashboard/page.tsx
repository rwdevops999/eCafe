'use client'

import EcafeButton from "@/components/ecafe/ecafe-button";
import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import { initDB } from "@/lib/db";
import { log } from "@/lib/utils";

const Dashboard = () => {
  const initializeDB = () => {
    log(true, "Dashboard", "Initializing DB");
    
    initDB('*');
  };

  const provisionCountries = () => {
    log(true, "Dashboard", "Initializing DB");
    
    initDB('country');
  };

  return (
    <>
      <PageBreadCrumbs crumbs={[{name: "dashboard"}]} />
      <EcafeButton className="mt-5" caption="Initialize Database" clickHandler={initializeDB} />
      <EcafeButton className="mt-5" caption="Setup Countries" clickHandler={provisionCountries} />
    </>
  )
}

export default Dashboard;