import { handleDeletefromOtpByEmailAndDate, handleDeleteOtpByEmailAndDate, handleDeleteOtpById, handleLoadOTP, handleUnblockUser } from "@/lib/db";
import { ApiResponseType } from "@/types/db";
import { OtpType } from "@/types/ecafe";

export const ACTION_TYPE_OTP="OTP"
export const ACTION_TYPE_USER="USER"
export const actionTypes: string[] = [ACTION_TYPE_OTP, ACTION_TYPE_USER];

export const taskStatusses: string[] = ["open", "completed"];

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

const convertToLocalTime = (date: Date): string => {
    return new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString();
}

const otpDeletedCallback = (_data: ApiResponseType) => {
    console.log("OTP DELETED");
}

const loadedOtpCallback = (data: any, info: ActionExecutionType) => {
    console.log("TaskInfo", "loadedOtpCallback", JSON.stringify(data));
    if (data.status === 404) {
        console.log("TaskInfo", "otpDeletedCallbackWithData", `OTP ${info.subjectId} is deleted => task is complete`);
        updateTaskStatus(info.taskId, "completed");
    } else {
        console.log("TaskInfo", "otpDeletedCallbackWithData", `OTP ${info.subjectId} is not yet deleted => task is NOT complete`);
    }
}

const otpDeletedCallbackWithData = (_data: ApiResponseType, info: ActionExecutionType) => {
    console.log("TaskInfo", "otpDeletedCallbackWithData", "OTP DELETED : DATA => ", JSON.stringify(_data.payload));

    if (_data.status === 410) {
        // payload is something like {count: n}
        const response: any = _data.payload;

        if (response.count > 0) {
            handleLoadOTP(info.subjectId.toString(), loadedOtpCallback, info);
        }
    }
}

const otpLoadedCallback = (_data: any, _info: ActionExecutionType) => {
    console.log("TaskInfo", "optLoadedCallback", JSON.stringify(_data));
    if (_data.status === 200) {
        const otp: OtpType = _data.payload;
        console.log("TaskInfo", "optLoadedCallback", "PAYLOAD", JSON.stringify(otp));

        if (_info.related) {
            console.log("TaskInfo", "optLoadedCallback", "RELATED");
            handleDeleteOtpByEmailAndDate(otp.email, convertToLocalTime(new Date()), otpDeletedCallbackWithData, _info);
        } else {
            console.log("TaskInfo", "optLoadedCallback", "NOT RELATED");
            handleDeleteOtpById(otp.id!, otpDeletedCallback);
        }
    } else {
        console.log("ERROR in OTP Loading => can't delete anything");
    }
}

export const handleRemoveOTP = (_info: ActionExecutionType) => {
    console.log("TaskInfo", "handleRemoveOTP", JSON.stringify(_info));
    console.log("TaskInfo", "handleRemoveOTP", `loading OTP with id ${_info.subjectId}`);

    handleLoadOTP(_info.subjectId.toString(), otpLoadedCallback, _info);
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
