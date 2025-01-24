'use client'

import { useEffect, useState } from "react";
import { TestMetaType } from "../page";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import EcafeButton from "@/components/ecafe/ecafe-button";
import { DialogHeader } from "@/components/ui/dialog";
import PageTitle from "@/components/ecafe/page-title";
import { Separator } from "@radix-ui/react-separator";
import { TabsContent, TabsList } from "@/components/ui/tabs";
import { Tabs, TabsTrigger } from "@radix-ui/react-tabs";
import Tab1 from "./tab1";
import Tab2 from "./tab2";
import Tab3 from "./tab3";

const TestDialog = ({meta}:{meta: TestMetaType}) => {

  const [metaForDialog, setMetaForDialog] = useState<TestMetaType>(meta);
  const [open, setOpen] = useState<boolean>(false);
  
  useEffect(() => {
    console.log("DIALOG USE EFFECT");
      setMetaForDialog(meta);
  }, []);

  const changeMeta = () => {
    meta.data = "TestDialog";
    meta.test = meta.test ? {test: "TestDialog"} : {test: "TestDialog(undefined)"};

    (meta.changeMeta ? meta.changeMeta(meta) : (_meta: TestMetaType) => {})
  };

  const handleDialogState = (state: boolean) => {
    setOpen(state);
  }

  const renderComponent = () => {
    console.log("DIALOG RENDER");
    if (metaForDialog === undefined) {
      return (
        <div>
          <Button onClick={changeMeta}>Change</Button>
        </div>);
    }

    return (
      <>
        Dialog: {metaForDialog.data} - {metaForDialog.test?.test}
        <Dialog open={open}>
        <DialogTrigger asChild>
          <EcafeButton id="dialogButton" className="bg-orange-400 hover:bg-orange-600 mr-3" caption="Manage user" clickHandler={handleDialogState} clickValue={true} />
        </DialogTrigger>
        <DialogContent className="min-w-[75%]" aria-describedby="">
          <DialogHeader className="mb-2">
            <DialogTitle>
              <PageTitle title="Manage user" className="m-2 -ml-[2px]"/>
              <Separator className="bg-red-500"/>
            </DialogTitle>
          </DialogHeader>

          <Tabs className="w-[100%]" defaultValue="tab1">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="tab1">Tab1</TabsTrigger>
              <TabsTrigger value="tab2" >Tab2</TabsTrigger>
              <TabsTrigger value="tab3" >Tab3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">
              <div className="m-1 container w-[99%]">
              <Tab1 meta={metaForDialog} />
              </div>
            </TabsContent>
            <TabsContent value="tab2">
              <div className="m-1 container w-[99%]">
              <Tab2 meta={metaForDialog} />
              </div>
            </TabsContent>
            <TabsContent value="tab3">
              <div className="m-1 container w-[99%]">
              <Tab3 meta={metaForDialog} />
              </div>
            </TabsContent>
            </Tabs>

        </DialogContent>
      </Dialog>
    </>
    );
  }

  return (<>{renderComponent()}</>);
}

export default TestDialog;