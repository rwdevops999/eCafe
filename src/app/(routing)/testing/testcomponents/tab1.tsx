import { Button } from "@/components/ui/button"
import { TestMetaType } from "../page"
import { useEffect } from "react"

const Tab1 = ({meta}:{meta: TestMetaType}) => {
    // const change1 = () => {
    // }

    const updateMeta = () => {
        meta.data = "Hello From Tab1";
        meta.test = meta.test ? {test: "Tab1"} : {test: "Tab1(undefined)"};

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
            Tab1: {meta.data}
            {/* <Button onClick={change1}>Change1</Button> */}
        </div>
    )
}

export default Tab1