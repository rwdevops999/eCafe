'use client'

import ServiceSelect from "@/components/ecafe/service-select";
import { Button } from "@/components/ui/button";
import { cuv, js, showToast } from "@/lib/utils";
import { ServiceType, UseStateValue } from "@/types/ecafe";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Test = () => {
  const {push} = useRouter();
  
  const ftest = () => {
    let x: UseStateValue = cuv(undefined);

    console.log("X = ", x);
    console.log("X(2) = ", js(x));
  }

  useEffect(() => {
    console.log("MOUNT TEST");
    ftest();
    return (() => console.log("UNMOUNT TEST"));
  }, [])

  const handleButtonClick = () => {
    push("/iam/statements/sid=25");
  }

  const [service, setService] = useState<number|string|undefined>(undefined);

  const handleServiceUndefined = () => {
    setService(undefined);
  }

  const handleServiceId = () => {
    setService(1);
  }

  const handleServiceName = () => {
    setService('Settings');
  }

  const handleChangeService = (service: ServiceType|undefined) => {
    showToast("info", `Service = ${js(service)}`);
  }

  const handleGetSelectedService = (service: ServiceType|undefined) => {
    showToast("info", `Selected Service = ${js(service)}`);
  }

  const renderComponent = () => {
    return (
    <>
      <Button onClick={handleButtonClick}>TEST</Button>
      <Button onClick={handleServiceUndefined}>Service (undefined)</Button>
      <Button onClick={handleServiceId}>Service (id)</Button>
      <Button onClick={handleServiceName}>Service (name)</Button>

      <ServiceSelect defaultService={service} handleChangeService={handleChangeService} onInit={handleGetSelectedService}/>
    </>);
    };

  return (<>{renderComponent()}</>);
}

export default Test;