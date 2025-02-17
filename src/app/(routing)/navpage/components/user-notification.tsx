import { Bell } from "lucide-react"

const UserNotifications = () => {
    return (
        <div className="flex items-center space-x-2">
            <div><Bell width={16} height={16}/></div>
            <div>Notifications</div>
        </div>
    )
}

export default UserNotifications;