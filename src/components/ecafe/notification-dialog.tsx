'use client'

import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";
import { AlertDialogAction, AlertDialogCancel, AlertDialogDescription, AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { useEffect, useState } from "react";

const NotificationDialog = (
    {
        _open, 
        _title,
        _message,
        _handleButtonLeft, 
        _handleButtonRight,
        _buttonnames = {leftButton: "Cancel", rightButton: "Continue"}
    }
    :
    {
        _open: boolean; 
        _title: string,
        _message: string,
        _handleButtonLeft?(name: string): void; 
        _handleButtonRight?(name: string): void;
        _buttonnames?: {leftButton: string, rightButton: string}
        }) => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const handleButtonLeft = () => {
        _handleButtonLeft ? _handleButtonLeft(_buttonnames.leftButton) : null;
    }

    const handleButtonRight = () => {
        _handleButtonRight ? _handleButtonRight(_buttonnames.rightButton) : null;
    }

  return (
    <AlertDialog open={_open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{_title}</AlertDialogTitle>
          <AlertDialogDescription>
            {_message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleButtonLeft}>{_buttonnames.leftButton}</AlertDialogCancel>
          <AlertDialogAction onClick={handleButtonRight}>{_buttonnames.rightButton}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default NotificationDialog;

/** USAGE
 * 
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

  */