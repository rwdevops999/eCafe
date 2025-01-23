import { Button } from "@/components/ui/button";
import { TestMetaType } from "../page"
import { useEffect } from "react";

const Tab3 = ({meta}:{meta: TestMetaType}) => {
  const change3 = () => {
    meta.data = "Hello From Tab3";
    if (meta.changeMeta) {
        meta.changeMeta(meta);
      } else {
        console.log("(3) changeMeta undefined");
      }
    }

  const updateMeta = () => {
    meta.data = "Hello From Tab3";
    meta.test = meta.test ? {test: "Tab3"} : {test: "Tab3(undefined)"};

    meta.changeMeta ? meta.changeMeta(meta) : null;
    // if (meta.changeMeta) {
    //     meta.changeMeta(meta);
    // } else {
    //     console.log("(1) changeMeta undefined");
    // }
  }

  useEffect(() => {
    updateMeta();
  }, [])

  return (
    <div>
      Tab3: {meta.data}
      {/* <Button onClick={change3}>Change3</Button> */}
      </div>
  )
}

export default Tab3