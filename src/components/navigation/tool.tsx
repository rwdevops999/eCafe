import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { SidebarToolType } from "@/data/navigation-scheme";

const Tool = ({open, tool}:{open:boolean; tool: SidebarToolType}) => {
  const {t} = useTranslation();

  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
      setIsClient(true);
    });

    const renderComponent = () => {
      return (
        <>
          {!open && <div className="flex">
              {tool.child}
            </div>}

          {open && <div hidden={open} className="ml-2 flex items-center justify-between">
              <div className="flex">
                  <tool.icon size={18}/>
                  <div className="ml-2 mb-1 capitalize">{isClient ? t(tool.tkey) : tool.tkey}</div>
              </div>
              {tool.child}
          </div>}
        </>
      );
    }

  return (<>{renderComponent()}</>)
}

export default Tool;