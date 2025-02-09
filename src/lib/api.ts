import { CallbackFunctionSubjectLoaded, EmailType } from "@/types/ecafe"

/**
 * DB
 */
export const sendEmail = async (email: EmailType, _callback: CallbackFunctionSubjectLoaded) => {
  const res = await fetch('http://localhost:3000/api/send',{
    method: 'POST',
    body: JSON.stringify(email),
    headers: {
      'content-type': 'application/json'
    }
  })
  .then((response) => response.json())
  .then((response) => {
    _callback(response);
  });
}

export const handleSendEmail = async (email: EmailType, _callback: CallbackFunctionSubjectLoaded) => {
  await sendEmail(email, _callback);
}

