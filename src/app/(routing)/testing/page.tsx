'use client'

import { useEffect, useState } from "react";
import TestDialog from "./testcomponents/test-dialog";

export type TestMetaType = {
  data: string
  test?: {
    test: string
  }
  changeMeta?: (meta: TestMetaType) => void
  sayHello?: (s: string) => void
}

const Test = () => {

  const [reload, setReload] = useState<number>(0);

  const changeMeta = (meta: TestMetaType) => {
    setMetaForPage(meta);
    setReload((x: number) => x+1);
  }

  const [metaForPage, setMetaForPage] = useState<TestMetaType>();

  useEffect(() => {
    console.log("PAGE USE EFFECT");
    let meta: TestMetaType = {
      data : "TestPage",
      test: {
        test: "TestPage"
      },
      changeMeta: changeMeta
    }
  
    setMetaForPage(meta);
  }, [])

  const renderComponent = () => {
    console.log("PAGE RENDER");

    if (metaForPage) {
      return (
        <>
          {metaForPage.data} - {metaForPage.test?.test}

          <TestDialog meta={metaForPage} />
        </>
      );
    }

    return null;
};


  return (<>{renderComponent()}</>)
}

export default Test