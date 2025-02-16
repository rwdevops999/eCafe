'use client'

import { Button } from "@/components/ui/button";
import { hideLoaderToast, showLoaderToast } from "@/lib/utils";
import { useEffect } from "react";
import { toast } from "sonner";

const Test = () => {
  const ftest = () => {
  }

  useEffect(() => {
    ftest();
  }, [])

  const showToast = () => {
    showLoaderToast("Test Load...");
  }

  const hideToast = () => {
    hideLoaderToast();
  }

  const renderComponent = () => {
    return (
    <>
      <Button onClick={showToast}>Show</Button>
      <Button onClick={hideToast}>Hide</Button>
    </>);
    };

  return (<>{renderComponent()}</>);
}

export default Test;