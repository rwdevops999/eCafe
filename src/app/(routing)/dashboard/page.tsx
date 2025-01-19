'use client'

import EcafeButton from "@/components/ecafe/ecafe-button";
import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import { log } from "@/lib/utils";

const initDB = async (table: string) => {
  const res = await fetch('http://localhost:3000/api/db?table='+table,{
      method: 'POST',
      body: JSON.stringify("initialise DB?"),
      headers: {
        'content-type': 'application/json'
      }
    })        
}


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