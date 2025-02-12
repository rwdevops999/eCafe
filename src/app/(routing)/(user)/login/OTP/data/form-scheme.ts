import { z } from "zod";

export const FormSchema = z.object({
  otpcode: z.string().min(6, {message: "The OTP code msut be 6 numbers."}),
}).required({
  otpcode: true,
});

export type FormSchemaType = z.infer<typeof FormSchema>;
  
