'use client'

import { Button } from "@/components/ui/button"
import { TestMetaType } from "../page"
import { useEffect, useState } from "react"

const Tab1 = ({meta}:{meta: TestMetaType}) => {

    const [metaForTab1, setMetaForTab1] = useState<TestMetaType>();

    const updateMeta = () => {
        meta.data = meta.data ? "Hello From Tab1" : "Tab1: undefined";
        meta.test = meta.test ? {test: "Tab1"} : {test: "Tab1(undefined)"};

        console.log("META(tab1): ", JSON.stringify(meta));
        meta.changeMeta ? meta.changeMeta(meta) : null;
        // if (meta.changeMeta) {
        //     meta.changeMeta(meta);
        // } else {
        //     console.log("(1) changeMeta undefined");
        // }
    }
    
    useEffect(() => {
        setMetaForTab1(meta);
        updateMeta();
    }, [])

    const renderComponent = () => {
        if (metaForTab1) {
            return (
                <div>
                    Tab1: {metaForTab1.data} - {metaForTab1.test?.test}
                    {/* <Button onClick={change1}>Change1</Button> */}
                </div>
            )
        }

        return null;
    }

    return (<>{renderComponent()}</>);
}

export default Tab1