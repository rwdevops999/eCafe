'use client'

import { ReactElement } from "react";
import { Button } from "../ui/button"
import { useRouter } from "next/navigation";
import ProgressLink from "../ecafe/progress-link";

const Menubutton = ({icon, name, url}:{icon:ReactElement; name:string, url: string}) => {
    const router = useRouter();
    
    const handleUrl = (url: string) => {
        router.push(url);
    };

    return (
        <ProgressLink href={url} className="flex items-center">
            {icon}
            {name}
        </ProgressLink>
        // <div className="-ml-4 flex items-center">
        //     <Button variant="ghost" onClick={() => handleUrl(url)} className="h-4 ml-1">
        //         {icon}
        //         {name}
        //     </Button>
        // </div>
  )
}

export default Menubutton