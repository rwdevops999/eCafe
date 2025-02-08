'use client'

import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  return (
    <>
        <h1>eCafé</h1>
        <Button asChild>
            <LoginLink>Sign In</LoginLink>
        </Button>
    </>
  )
}

export default LoginPage;