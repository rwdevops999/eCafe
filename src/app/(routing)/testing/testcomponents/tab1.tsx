'use client'

import { Button } from "@/components/ui/button"
import { TestMetaType } from "../page"
import { useEffect, useState } from "react"

const Tab1 = ({meta}:{meta: TestMetaType}) => {

    const [metaForTab1, setMetaForTab1] = useState<TestMetaType>();

    const sayHello = (s: string) => {
        console.log(s);
    }

    const updateMeta = () => {
        meta.data = meta.data ? "Hello From Tab1" : "Tab1: undefined";
        meta.test = meta.test ? {test: "Tab1"} : {test: "Tab1(undefined)"};

        meta.sayHello = meta.sayHello ? meta.sayHello : sayHello;

        meta.changeMeta ? meta.changeMeta(meta) : null;
        
        // if (meta.changeMeta) {
        //     meta.changeMeta(meta);
        // } else {
        //     console.log("(1) changeMeta undefined");
        // }
    }
    
    useEffect(() => {
        console.log("TAB1 USE EFFECT");
        setMetaForTab1(meta);
        updateMeta();
    }, [])

    const renderComponent = () => {
        console.log("TAB1 RENDER");
        if (metaForTab1) {
            return (
                <div>
                    Tab1: {metaForTab1.data} - {metaForTab1.test?.test}
                </div>
            )
        }

        return null;
    }

    return (<>{renderComponent()}</>);
}

export default Tab1