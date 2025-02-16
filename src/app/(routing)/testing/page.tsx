'use client'

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { toast } from "sonner";

const Test = () => {
  const ftest = () => {
  }

  useEffect(() => {
    ftest();
  }, [])

  let toastId: number | string = 0;
  
  const showToast = () => {
      toastId = toast.loading('Loading…', {
        style: {
          background: 'rgb(100,200,300)',
        },
      });
  }

  const hideToast = () => {
    toast.dismiss(toastId);
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