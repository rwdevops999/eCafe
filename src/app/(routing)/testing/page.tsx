'use client'

import EcafeButton from "@/components/ecafe/ecafe-button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import PageTitle from "@/components/ecafe/page-title";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Test = () => {
  const [open, setOpen] = useState<boolean>(false);

  const handleDialogState = (state: boolean) => {
    setOpen(state);
  }

  const renderComponent = () => {
      return (
        <Dialog open={open}>
          <DialogTrigger asChild>
          <EcafeButton id="dialogButton" className="bg-orange-400 hover:bg-orange-600 mr-3" caption="Manage user" clickHandler={handleDialogState} clickValue={true} />
        </DialogTrigger>
        <DialogContent variant="default" size="test" position="default">
          <DialogHeader className="mb-2">
            <DialogTitle>
              <PageTitle title="Manage user" className="m-2 -ml-[2px]"/>
              <Separator className="bg-red-500"/>
            </DialogTitle>
          </DialogHeader>
          {/* <Button>Test</Button> */}
        </DialogContent>
      </Dialog>
    );
  };


  return (<>{renderComponent()}</>)
}

export default Test