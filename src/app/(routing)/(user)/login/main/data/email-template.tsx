interface EmailTemplateProps {
    otpcode: string;
}
  
export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    otpcode,
}) => (
    <div>
      <h1>Welcome, the login code for eCafé is {otpcode}!</h1>
    </div>
);