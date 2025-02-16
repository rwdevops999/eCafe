import { ApiResponseType } from "@/types/db";
import { CallbackFunctionWithParam, EmailType, OtpType } from "@/types/ecafe"
import { js } from "./utils";

/**
 * DB
 */
export const sendEmail = async (emailInfo: EmailType, _callback: CallbackFunctionWithParam): Promise<void> => {
  const res = await fetch('http://localhost:3000/api/send',{
    method: 'POST',
    body: JSON.stringify(emailInfo),
    headers: {
      'content-type': 'application/json'
    }
  })
  .then((response: Response) => response.json())
  .then((response: ApiResponseType) => _callback(response))
  .catch((error: any) => console.log("sendEmial", "ERROR sending email", js(error)));
}

export const handleSendEmail = async (emailInfo: EmailType, _callback: CallbackFunctionWithParam): Promise<void> => {
  await sendEmail(emailInfo, _callback);
}

