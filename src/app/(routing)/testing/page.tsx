'use client'

import AllowDenySwitch from "@/components/ecafe/allow-deny-switch";

const Test = () => {
  const ftest = () => {
  }

  const handleChangeAccess = (value: string) => {
    console.log(`Access = ${value}`);
  }

  const renderComponent = () => {
    return (
    <>
    <AllowDenySwitch accessFn={handleChangeAccess} value={"Allow"}/>
    </>);
    };

  return (<>{renderComponent()}</>);
}

export default Test;