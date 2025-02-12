'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import Task from "./task";
import { Root, VisuallyHidden } from "@radix-ui/react-visually-hidden";

const TaskDialog = ({_open, _taskId = 0, handleDialogClose}:{_open: boolean; _taskId?: number; handleDialogClose(): void;}) => {
    const [dialogState, setDialogState] = useState<boolean>(false);

    useEffect(() => {
        setDialogState(_open);
    }, [_open]);

    return (
        <Dialog open={dialogState}>
            <DialogContent className="flex justify-center items-center border-none min-w-[55%] min-h-[50%]">
                <Root>
                    <DialogTitle />
                    <DialogDescription />
                </Root>
                <Task taskId={_taskId} handleDialogClose={handleDialogClose}/>
            </DialogContent>
        </Dialog>
  )
}

export default TaskDialog;