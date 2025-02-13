import { handleDeletefromOtpByEmailAndDate, handleDeleteFromOtpById, handleLoadOTP, handleLoadTask, handleUnblockUser, handleUpdateUser } from "@/lib/db";
import { OtpType } from "@/types/ecafe";

export const ACTION_TYPE_OTP="OTP"
export const ACTION_TYPE_USER="USER"

export const ACTION_REMOVE_OTP="Remove OTP"
export const ACTION_UNBLOCK_USER="Unblock User"

export type ActionFunctionType = (_info: ActionExecutionType) => void;

export type ActionFunction = {
    id: number,
    type: string,
    action: string,
    func: ActionFunctionType
}

export type ActionExecutionType = {
    taskId: number,
    subjectId: number,
    related: boolean
}

const updateTaskStatus = async (_taskId: number, _status: string) => {
    console.log("TaskInfo", "updateTaskStatus", _taskId, _status);
    await fetch(`http://localhost:3000/api/task?taskId=${_taskId}&status=${_status}`,
        {
          method: 'PUT',
        })
        .then(response => response.json())
        .then(response => console.log("UPDATE TASK RESPONSE", JSON.stringify(response)));
}

function converToLocalTime(date: Date) {
    
    let s: string = date.toISOString().replace('T', ' ').slice(0, date.toISOString().length-1);
    console.log("ISO = ", s);

    return s;
}

const subtractHours = (_date: string, _day: number): string => {
    let date: Date = new Date(_date);

    date.setHours(date.getHours() - 1);

    return converToLocalTime(date);
}

const otpDeletedCallback = () => {
    console.log("OTP DELETED");
}

const otpDeletedCallbackWithData = (data: any) => {
    console.log("OTP DELETED : DATA => " + JSON.stringify(data.payload));
}

const otpLoadedCallback = (data: any, related: boolean) => {
    console.log("TaskInfo", "optLoadedCallback", JSON.stringify(data), related);
    if (data.status === 200) {
        const otp: OtpType = data.payload;

        if (related) {
            console.log("TaskInfo", "optLoadedCallback", "GET OTPS");
            handleDeletefromOtpByEmailAndDate(otp.email, subtractHours(otp.createDate!, 1), otpDeletedCallbackWithData);
        } else {
            handleDeleteFromOtpById(otp.id!, otpDeletedCallback);
        }
    } else {
        console.log("ERROR in OTP Loading => can't delete anything");
    }
}

export const handleRemoveOTP = (_info: ActionExecutionType) => {
    console.log("TaskInfo", "handleRemoveOTP", JSON.stringify(_info));
    handleLoadOTP(_info.subjectId.toString(), otpLoadedCallback, _info.related);
    updateTaskStatus(_info.taskId, "completed");
}

export const handleUserUnblock = (_info: ActionExecutionType) => {
    console.log("TaskInfo", "handleUnblockUser", JSON.stringify(_info));
    handleUnblockUser(_info.subjectId, () => {});
    updateTaskStatus(_info.taskId, "completed");
}

export const actionFunctions: ActionFunction[] = [
    {
        id: 1,
        type: ACTION_TYPE_OTP,
        action: ACTION_REMOVE_OTP,
        func: handleRemoveOTP
    },
    {
        id: 2,
        type: ACTION_TYPE_USER,
        action: ACTION_UNBLOCK_USER,
        func: handleUserUnblock
    }
]

