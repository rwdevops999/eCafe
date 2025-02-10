'use client'

import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";
import { AlertDialogAction, AlertDialogCancel, AlertDialogDescription, AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import { NotificationButtonsType } from "@/types/ecafe";
import { cn } from "@/lib/utils";

const NotificationDialog = (
    {
        _open, 
        _title,
        _message,
        _handleButtonLeft, 
        _handleButtonCenter,
        _handleButtonRight,
        _buttonnames = {leftButton: "No", rightButton: "Yes"},
        className
    }
    :
    {
        _open: boolean; 
        _title: string,
        _message: string,
        _handleButtonLeft?(name: string): void; 
        _handleButtonCenter?(name: string): void;
        _handleButtonRight?(name: string): void;
        _buttonnames?: NotificationButtonsType,
        className?: string
        }) => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const handleButtonLeft = () => {
        _handleButtonLeft ? _handleButtonLeft(_buttonnames.leftButton??"LEFT (undefined)") : null;
    }

    const handleButtonRight = () => {
        _handleButtonRight ? _handleButtonRight(_buttonnames.rightButton??"RIGHT (undefined)") : null;
    }

    const handleButtonCenter = () => {
      _handleButtonCenter ? _handleButtonCenter(_buttonnames.centerButton??"CENTER (undefined)") : null;
  }

return (
    <AlertDialog open={_open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500 font-bold text-2xl">{_title}</AlertDialogTitle>
          <Separator className="bg-red-300" />
          <AlertDialogDescription>
            {_message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className={cn("space-x-2", className)}>
          <AlertDialogFooter>
            {/* <div className={cn("flex justify-center space-x-2", className)}> */}
              {_buttonnames.leftButton && <AlertDialogCancel onClick={handleButtonLeft}>{_buttonnames.leftButton}</AlertDialogCancel>}
              {_buttonnames.centerButton && <AlertDialogCancel onClick={handleButtonCenter}>{_buttonnames.centerButton}</AlertDialogCancel>}
              {_buttonnames.rightButton && <AlertDialogCancel onClick={handleButtonRight}>{_buttonnames.rightButton}</AlertDialogCancel>}
          </AlertDialogFooter>
        </div>
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