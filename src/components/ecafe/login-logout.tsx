'use client'

import { LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { UserType } from "@/types/ecafe";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const LoginLogout = () => {
    const {user, setUser} = useUser();
    const router = useRouter();

    const doLogin = () => {
        console.log("Logging In");
        router.push("/login/main");
    }

    const doLogout = () => {
        setUser(undefined);
    }

    return (
        <div>
            {user && 
                <>
                    <div className="flex items-center">
                        <Button variant="ghost" onClick={doLogout} className="h-4">
                            <LogOut size={18} className="mr-2"/>
                            Log Out
                        </Button>
                    </div>
            </>
        }
            {!user && 
                <>
                    <div className="-ml-4 flex items-center">
                        <Button variant="ghost" onClick={doLogin} className="h-4">
                            <LogIn size={18} className="mr-2" />
                            Log In
                        </Button>
                    </div>
                </>
            }
        </div>
    )
}

export default LoginLogout;