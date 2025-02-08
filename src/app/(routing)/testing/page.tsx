'use client'

import { Button } from "@/components/ui/button";
import LoadingSpinner from "./loading-spinner";
import { useRef, useState } from "react";
import Loader from "./loader";
import PageTitle from "@/components/ecafe/page-title";

const Test = () => {
  const [loader, setLoader] = useState<boolean>(false);

  const showSpinner = () => {
    setLoader(true);
  }

  const hideSpinner = () => {
    setLoader(false);
  }

  const renderComponent = () => {
    return(
      <>
        <div className="flex space-x-2">
          <Button onClick={showSpinner}>Show Loader</Button>
          <Button onClick={hideSpinner}>Hide Loader</Button>

          <div className="flex space-x-2">
            <PageTitle className="m-2" title={`Test Page`} />
            <Loader className={loader ? "" : "hidden"} />
          </div>
        </div>
      </>
    );
  };

  return (<>{renderComponent()}</>);
}

export default Test;