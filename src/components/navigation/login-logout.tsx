'use client'

import { LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { UserType } from "@/types/ecafe";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConsoleLogger } from "@/lib/console.logger";
import { useDebug } from "@/hooks/use-debug";
import ProgressLink from "../ecafe/progress-link";
import { cn } from "@/lib/utils";

const LoginLogout = ({className}:{className?:string}) => {
    const {isLoggedIn, logout} = useUser();
    const router = useRouter();
    const {debug} = useDebug();

    const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});
    
    const doLogin = () => {
        logger.debug("LoginLogout", "Logging In");
        router.push("/login/main");
    }

    const doLogout = () => {
        logout();
    }

    return (
        <div>
            {isLoggedIn() && 
                <>
                    <div className="-ml-4 flex items-center">
                        <Button variant="ghost" onClick={doLogout} className="h-4 ml-1">
                            <LogOut size={18} className="mr-2"/>
                            Log Out
                        </Button>
                    </div>
            </>
        }
            {!isLoggedIn() && 
                    <ProgressLink href="/login/main" className={cn("flex items-center", className)}>
                        <LogIn size={18} className="mr-2"/>
                        Log In
                    </ProgressLink>
            //   {/* <div className="-ml-4 flex items-center">
            //             <Button variant="ghost" onClick={doLogin} className="h-4 ml-1">
            //                 <LogIn size={18} className="mr-2" />
            //                 Log In
            //             </Button>
            //         </div> */}
            }
        </div>
    )
}

export default LoginLogout;