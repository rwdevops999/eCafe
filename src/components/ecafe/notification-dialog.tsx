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
        className,
        _data
    }
    :
    {
        _open: boolean; 
        _title: string,
        _message: string,
        _handleButtonLeft?(name: string, data?: any): void; 
        _handleButtonCenter?(name: string, data?: any): void;
        _handleButtonRight?(name: string, data?: any): void;
        _buttonnames?: NotificationButtonsType,
        className?: string,
        _data?: any
        }) => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const handleButtonLeft = () => {
        _handleButtonLeft ? _handleButtonLeft(_buttonnames.leftButton??"LEFT (undefined)", _data) : null;
    }

    const handleButtonRight = () => {
        _handleButtonRight ? _handleButtonRight(_buttonnames.rightButton??"RIGHT (undefined)", _data) : null;
    }

    const handleButtonCenter = () => {
      _handleButtonCenter ? _handleButtonCenter(_buttonnames.centerButton??"CENTER (undefined)", _data) : null;
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
  const buttons: NotificationButtonsType = {leftButton: "Left", centerButton: "Center", rightButton: "Right"};

  const handleButton = (name: string) => {
    console.log("HandleButton", name);

    if (name === buttons.leftButton) {
      console.log("Handle Left");
    }

    if (name === buttons.centerButton) {
      console.log("Handle Center");
    }

    if (name === buttons.rightButton) {
      console.log("Handle Right");
    }

    // setDialogState(false);
  }

  const renderComponent = () => {
    return(
      <>
        <Button onClick={handleOpen}>Test</Button>
        <NotificationDialog 
          _open={open} 
          _handleButtonLeft={handleButton} 
          _handleButtonCenter={handleButton}
          _handleButtonRight={handleButton}
          _title={dialogTitle}
          _message={dialogMessage}
          _buttonnames={buttons}
          // className="flex justify-center"
        />
      </>
    );
  };

  */