'use client'

import { useState } from "react";
import TestDialog from "./testcomponents/test-dialog";

export type TestMetaType = {
  data: string
  test?: {
    test: string
  }
  changeMeta?: (meta: TestMetaType) => void
}

const Test = () => {

  const [reload, setReload] = useState<number>(0);

  const changeMeta = (meta: TestMetaType) => {
    console.log("TestPage: changeMeta");
    testMeta = meta;
    setReload((x: number) => x+1);
  }

  let testMeta: TestMetaType = {
    data : "TestPage",
    test: {
      test: "TestPage"
    },
    changeMeta: changeMeta
  }

  const renderComponent = () => {

  return (
    <>
      {testMeta.data} - {testMeta.test?.test}

      <TestDialog meta={testMeta} />
    </>
  );
};


  return (<>{renderComponent()}</>)
}

export default Test