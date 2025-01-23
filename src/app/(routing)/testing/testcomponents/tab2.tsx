import { Button } from "@/components/ui/button";
import { TestMetaType } from "../page"
import { useEffect } from "react";

const Tab2 = ({meta}:{meta: TestMetaType}) => {
  const change2 = () => {
    console.log("(2) change2 clicked");
    meta.data = "Hello From Tab2";
    if (meta.changeMeta) {
      console.log("(2) calling changeMeta");
      meta.changeMeta(meta);
      } else {
        console.log("(2) changeMeta undefined");
      }
  }

  const updateMeta = () => {
    meta.data = "Hello From Tab2";
    meta.test = meta.test ? {test: "Tab2"} : {test: "Tab2(undefined)"};

    meta.changeMeta ? meta.changeMeta(meta) : null;
// if (meta.changeMeta) {
//         meta.changeMeta(meta);
//     } else {
//         console.log("(1) changeMeta undefined");
//     }
  }

  useEffect(() => {
      updateMeta();
  }, [])

  return (
    <div>
      Tab2: {meta.data}
      {/* <Button onClick={change2}>Change2</Button> */}
      </div>
  )
}

export default Tab2