import { SidebarHeaderType } from "@/data/navigation-scheme";
import Link from "next/link";
import ProgressLink from "../ecafe/progress-link";

const HeaderLink = ({header}:{header:SidebarHeaderType}) => {
    const renderComponent = () => {
        return(
            <div className="flex space-x-3 items-center">
                <div>
                    {/* <Link href={header.url}> */}
                    <ProgressLink href={header.url}>
                        <header.logo className="size-4"/>
                    </ProgressLink>
                    {/* </Link> */}
                </div>
                <div>
                <ProgressLink href={header.url}>
                {/* <Link href={header.url}> */}
                        <span>{header.name}</span>
                    {/* </Link> */}
                    </ProgressLink>
                </div>
            </div>
        );
    }

  return(<>{renderComponent()}</>);
}

export default HeaderLink