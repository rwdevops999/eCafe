'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePathname } from "next/navigation"
import { HTMLAttributes } from "react"
import DashboardPage1 from "./pages/dashboard-page-1"
import DashboardPage2 from "./pages/dashboard-page-2"
import DashboardPage3 from "./pages/dashboard-page-3"

interface NavProps extends HTMLAttributes<HTMLDivElement> {}

const navigations = [
    {
        name: "Page1",
        page: <DashboardPage1 />,
    },
    {
        name: "Page2",
        page: <DashboardPage2 />,
    },
    {
        name: "Page3",
        page: <DashboardPage3 />,
    },
]
  
const Nav = ({className, ...props}:NavProps) => {
    const pathname = usePathname()

    return (
    <div>
        <Tabs defaultValue={navigations[0].name.toLowerCase()} className="w-[400px] space-x-2">
            {/* <TabsList className="grid w-full grid-cols-2 bg-red-500"> */}
            <TabsList>
                {navigations.map((navigation) => (
                    <TabsTrigger className="flex h-7 items-center justify-center px-4 text-center text-sm rounded-full hover:text-primary" key={navigation.name.toLowerCase()} value={navigation.name.toLowerCase()}>{navigation.name}</TabsTrigger>
                ))}
            </TabsList>
            {navigations.map((navigation) => (
                <TabsContent key={navigation.name.toLowerCase()} value={navigation.name.toLowerCase()}>
                    {navigation.page}
                </TabsContent>
            ))}
        </Tabs>


    </div>
  )
}

export default Nav