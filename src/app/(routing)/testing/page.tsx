'use client'

import { Button } from "@/components/ui/button";
import { hideLoaderToast, showLoaderToast } from "@/lib/utils";
import { useEffect } from "react";
import { toast } from "sonner";
import moment from 'moment';

const Test = () => {
  const createDate: string = "2025-02-17T07:12:57.609Z";

  const ftest = () => {
    let timestamp: number = Date.parse(createDate);
    let res: Date = new Date(timestamp);

    let formattedDate: string = (moment(res)).format('DD-MMM-YYYY HH:mm:ss')

    console.log("DATE = ", formattedDate);
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