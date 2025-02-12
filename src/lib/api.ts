import { CallbackFunctionSubjectLoaded, EmailType, OtpType } from "@/types/ecafe"

/**
 * DB
 */
export const sendEmail = async (emailInfo: EmailType, _callback: CallbackFunctionSubjectLoaded) => {
  const res = await fetch('http://localhost:3000/api/send',{
    method: 'POST',
    body: JSON.stringify(emailInfo),
    headers: {
      'content-type': 'application/json'
    }
  })
  .then((response) => response.json())
  .then((response) => {
    _callback(response);
  });
}

export const handleSendEmail = async (emailInfo: EmailType, _callback: CallbackFunctionSubjectLoaded) => {
  await sendEmail(emailInfo, _callback);
}

