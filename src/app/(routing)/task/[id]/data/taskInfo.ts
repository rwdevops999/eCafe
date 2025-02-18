import { handleDeleteExpiredOtpsByEmail, handleDeleteOtpById, handleLoadOTP, handleUnblockUser } from "@/lib/db";
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
}

const loadedOtpCallback = (data: any, info: ActionExecutionType) => {
    if (data.status === 404) {
        updateTaskStatus(info.taskId, "completed");
    }
}

const otpDeletedCallbackWithData = (_data: ApiResponseType, info: ActionExecutionType) => {
    if (_data.status === 410) {
        // payload is something like {count: n}
        const response: any = _data.payload;

        if (response.count > 0) {
            handleLoadOTP(info.subjectId.toString(), loadedOtpCallback, info);
        }
    }
}

const otpLoadedCallback = (_data: any, _info: ActionExecutionType) => {
    if (_data.status === 200) {
        const otp: OtpType = _data.payload;

        if (_info.related) {
            handleDeleteExpiredOtpsByEmail(otp.email, otpDeletedCallbackWithData, _info);
        } else {
            handleDeleteOtpById(otp.id!, otpDeletedCallback);
        }
    }
}

export const handleRemoveOTP = (_info: ActionExecutionType) => {
    handleLoadOTP(_info.subjectId.toString(), otpLoadedCallback, _info);
}

export const handleUserUnblock = (_info: ActionExecutionType) => {
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
