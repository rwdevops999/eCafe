import { Button } from "@/components/ui/button";
import { TestMetaType } from "../page"
import { useEffect, useState } from "react";

const Tab3 = ({meta}:{meta: TestMetaType}) => {

  const [metaForTab3, setMetaForTab3] = useState<TestMetaType>();

  const updateMeta = () => {
    meta.data = meta.data ? "Hello From Tab3" : "Tab2: undefined";
    meta.test = meta.test ? {test: "Tab3"} : {test: "Tab3(undefined)"};

    console.log("META(tab3): ", JSON.stringify(meta));
    meta.changeMeta ? meta.changeMeta(meta) : null;
}

  useEffect(() => {
    setMetaForTab3(meta);
    // updateMeta();
  }, [])

  const renderComponent = () => {
    if (metaForTab3) {
        return (
            <div>
                Tab3: {metaForTab3.data} - {metaForTab3.test?.test}
            </div>
        )
    }

    return null;
  }

  return (<>{renderComponent()}</>);
}

export default Tab3