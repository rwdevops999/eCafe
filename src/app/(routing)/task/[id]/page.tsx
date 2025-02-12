'use client'

import { use, useEffect, useState } from "react";
import TaskDialog from "./components/task-dialog";
import { useParams, useRouter } from "next/navigation";

const TaskId = () => {
    const {id} = useParams<{ id: string }>()
    const { back } = useRouter();

    const [openDialog, setOpenDialog] = useState<boolean>(false);

    useEffect(() => {
        setOpenDialog(true);
    }, [id]);

    const handleDialogClose = () => {
        setOpenDialog(false);
        back();
    }

    return (
        <TaskDialog _taskId={parseInt(id)} _open={openDialog} handleDialogClose={handleDialogClose}/>
    );
}

export default TaskId;