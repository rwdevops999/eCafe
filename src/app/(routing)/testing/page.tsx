'use client'

import { Button } from "@/components/ui/button";
import { hideLoaderToast, js, showLoaderToast } from "@/lib/utils";
import { useEffect } from "react";
import { toast } from "sonner";

const Test = () => {
  const ftest = () => {
  }

  useEffect(() => {
    ftest();
  }, [])

  let toastId: number|string = 0;

  const showToast = () => {
    if (toastId === 0) {
      const myPromise = new Promise<{ name: string }>((resolve) => {
            if (toastId === 0) {
              toastId = toast.loading("loading ...")
            }
            setTimeout(() => {
              resolve({ name: 'close toast' });
            }, 3000);
        });

        myPromise
        .then((value) => {
          toast.dismiss(toastId);
          toastId = 0;
        });
    }
    // toast.promise(myPromise, {
    //       loading: 'Loading...',
    //       success: (data: { name: string }) => {
    //         return `${data.name} toast has been added`;
    //       },
    //       error: 'Error',
    //     });
    //   }}
  }

  const hideToast = () => {
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