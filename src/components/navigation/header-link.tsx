import Link from "next/link";
import { SidebarHeaderType } from "../data/scheme";
import { log } from "@/lib/utils";

const HeaderLink = ({header}:{header:SidebarHeaderType}) => {
    const renderComponent = () => {
        return(
            <div className="flex space-x-3 items-center">
                <div>
                    <Link href={header.url}>
                        <header.logo className="size-4"/>
                    </Link>
                </div>
                <div>
                    <Link href={header.url}>
                        <span>{header.name}</span>
                    </Link>
                </div>
            </div>
        );
    }

  return(<>{renderComponent()}</>);
}

export default HeaderLink