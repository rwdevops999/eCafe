'use client'

import { LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { UserType } from "@/types/ecafe";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const LoginLogout = () => {
    const {user} = useUser();
    const router = useRouter();

    console.log("USER = " + user.email);

    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    const loggedInCallback = () => {
        console.log("Logged In");
    }

    const doLogin = () => {
        console.log("Logging In");
        setLoggedIn(true);
        router.push("/login/main");
    }

    const doLogout = () => {
        setLoggedIn(false);
    }

    useEffect(() => {
        let loggedIn: boolean = true;

        if (user.name === "") {
            loggedIn = false;
        } 

        setLoggedIn(loggedIn);
    }, []);

    return (
        <div>
            {loggedIn && 
                <>
                    <div className="flex items-center">
                        <LogOut size={18} className="mr-2"/>
                        Log Out
                    </div>
            </>
        }
            {!loggedIn && 
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