'use client'

import NotificationDialog from "@/components/ecafe/notification-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Test = () => {
  const [open, setOpen] = useState<boolean>(false);

  const setDialogState = (state: boolean): void => {
    setOpen(state);
  }

  const handleOpen = () => {
    setDialogState(true);
  }

  const dialogTitle: string = "Are you sure?";
  const dialogMessage: string = "You will be blocked";
  const buttons: {leftButton: string, rightButton: string} = {leftButton: "OK", rightButton: "Cancel"};

  const handleButton = (name: string) => {
    console.log("HandleButton", name);

    if (name === buttons.leftButton) {
      console.log("Handle OK");
    }

    if (name === buttons.rightButton) {
      console.log("Handle Cancel");
    }

    setDialogState(false);
  }

  const renderComponent = () => {
    return(
      <>
        <Button onClick={handleOpen}>Test</Button>
        <NotificationDialog 
          _open={open} 
          _handleButtonLeft={handleButton} 
          _handleButtonRight={handleButton}
          _title={dialogTitle}
          _message={dialogMessage}
          _buttonnames={buttons}
        />
      </>
    );
  };

  return (<>{renderComponent()}</>);
}

export default Test;