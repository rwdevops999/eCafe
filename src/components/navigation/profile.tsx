'use client'

import { Briefcase } from "lucide-react";
import { Button } from "../ui/button"
import { useRouter } from "next/navigation";

const Profile = () => {
    const router = useRouter();
    
    const showProfile = () => {
        router.push("/profile");
    };

    return (
        <div className="-ml-4 flex items-center">
            <Button variant="ghost" onClick={showProfile} className="h-4 ml-1">
                <Briefcase size={18} className="mr-2"/>
                Profile
            </Button>
        </div>
  )
}

export default Profile