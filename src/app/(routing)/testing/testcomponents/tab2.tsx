import { Button } from "@/components/ui/button";
import { TestMetaType } from "../page"
import { useEffect, useState } from "react";

const Tab2 = ({meta}:{meta: TestMetaType}) => {

  const [metaForTab2, setMetaForTab2] = useState<TestMetaType>();

  const updateMeta = () => {
    meta.data = meta.data ? "Hello From Tab2" : "Tab2: undefined";
    meta.test = meta.test ? {test: "Tab2"} : {test: "Tab2(undefined)"};

    console.log("META(tab2): ", JSON.stringify(meta));
    meta.changeMeta ? meta.changeMeta(meta) : null;
}

  useEffect(() => {
    setMetaForTab2(meta);
    updateMeta();
  }, [])

  const renderComponent = () => {
    if (metaForTab2) {
        return (
            <div>
                Tab2: {metaForTab2.data} - {metaForTab2.test?.test}
                {/* <Button onClick={change1}>Change1</Button> */}
            </div>
        )
    }

    return null;
  }

  return (<>{renderComponent()}</>);
}

export default Tab2