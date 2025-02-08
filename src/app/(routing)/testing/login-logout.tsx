'use client'

import { LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { UserType } from "@/types/ecafe";
import { useUser } from "@/hooks/use-user";

const LoginLogout = () => {
    const {user} = useUser();

    console.log("USER = " + user.email);

    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    const loggedInCallback = () => {
        console.log("Logged In");
    }

    const doLogin = () => {
        setLoggedIn(true);
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
                <LogoutLink>
                    <div className="flex items-center">
                        <LogOut size={18} className="mr-2"/>
                        Log Out
                    </div>
                </LogoutLink>
            </>
        }
            {!loggedIn && 
                <>
                    <LoginLink>
                        <div className="flex items-center">
                            <LogIn size={18} className="mr-2"/>
                            Log In
                        </div>
                    </LoginLink>
                </>
            }
        </div>
    )
}

export default LoginLogout;