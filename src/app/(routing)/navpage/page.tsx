import { Button } from "@/components/ui/button"
import { NavHeader, NavHeaderActions, NavHeaderDescription, NavHeaderHeading } from "./components/nav-header"
import ProgressLink from "@/components/ecafe/progress-link"
import Nav from "./components/nav"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"
import LoginLogout from "@/components/navigation/login-logout"

interface NavPageProps {
  children: ReactNode
}

const NavPage = ({children}: NavPageProps) => {
  return (
    // <div className="relative w-svw h-svh">
    <div className="absolute w-[80%] min-h-[100%]">
    <NavHeader>
        <NavHeaderHeading>
          eCafé
        </NavHeaderHeading>
        <NavHeaderDescription>
          The eCafé dashboard
        </NavHeaderDescription>
      </NavHeader>
        <div className="absolute py-1 h-[78%] w-[100%]">
          <section>
            <Nav />
            {/* <div className="overflow-hidden rounded-lg border bg-background shadow">
              {children}
            </div> */}
          </section>
      </div>
    </div>
  )
}


export default NavPage