import PageTitle from "@/components/ecafe/page-title";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabGroup from "./tabs/tab-group";
import { useEffect, useState } from "react";
import EcafeButton from "@/components/ecafe/ecafe-button";
import { GroupType } from "@/data/iam-scheme";
import { Meta } from "../../users/manage/tabs/data/meta";
import { CallbackFunctionDefault } from "@/data/types";
import { createGroup, updateGroup } from "@/lib/db";

const ManageGroupDialog = ({_enabled, group, handleReset, setReload}:{_enabled:boolean; group: GroupType|undefined; handleReset(): void; setReload(x:any):void;}) => {
  const [selectedGroup, setSelectedGroup] = useState<GroupType>();
  
  const [open, setOpen] = useState<boolean>(false);
    
  const handleDialogState = (state: boolean) => {
    setOpen(state);
  }

  const closeDialog = () => {
    handleReset();
    handleDialogState(false);
  }

  useEffect(() => {
      setSelectedGroup(group);
  }, [group]);
  
  const prepareGroup = (data: any): GroupType => {
    return {
      id: (selectedGroup ? selectedGroup.id : 0),
      name: data.name,
      description: data.description,
    }
  }

  const groupChangedCallback = () => {
    handleDialogState(false);
    setReload((x: any) => x+1);
  }

  const handleManageGroup = (data: any): void => {
    const group: GroupType = prepareGroup(data);
    if (group) {
      if  (selectedGroup) {
        updateGroup(group, groupChangedCallback);
      } else {
        createGroup(group, groupChangedCallback);
      }
      handleReset();
    }
  }

  const meta: Meta = {
    closeDialog: closeDialog,
    form: {
      register: (name: any, options?: any): any => {}
    },
    manageSubject: handleManageGroup,
  };

  const renderComponent = () => {
      return (
        <Dialog open={open}>
          <DialogTrigger asChild>
            <EcafeButton id="groupDialogButton" className="bg-orange-400 hover:bg-orange-600 mr-3" caption="Manage group" clickHandler={handleDialogState} clickValue={true} enabled={_enabled}/>
          </DialogTrigger>
          <DialogContent className="min-w-[75%]" aria-describedby="">
            <DialogHeader className="mb-2">
              <DialogTitle>
                <PageTitle title="Manage group" className="m-2 -ml-[2px]"/>
                <Separator className="bg-red-500"/>
              </DialogTitle>
            </DialogHeader>
    
            <Tabs defaultValue="groupdetails" className="w-[100%]">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="group">👨‍👦‍👦 Group</TabsTrigger>
                <TabsTrigger value="roles">🔖 Roles</TabsTrigger>
                <TabsTrigger value="policies">📜 Policies</TabsTrigger>
                <TabsTrigger value="groups">🙍🏻‍♂️ Users</TabsTrigger>
              </TabsList>
              <TabsContent value="group">
                <div className="m-1 container w-[99%]">
                  <TabGroup meta={meta} group={selectedGroup}/>
                </div>
              </TabsContent>
            {/* <TabsContent value="roles">
              <div className="m-1 container w-[99%]">
              <TabRoles />
              </div>
            </TabsContent>
            <TabsContent value="policies">
              <div className="m-1 container w-[99%]">
              <TabPolicies />
              </div>
            </TabsContent>
            <TabsContent value="groups">
              <div className="m-1 container w-[99%]">
              <TabGroups />
              </div>
            </TabsContent> */}
            </Tabs>
          </DialogContent>
        </Dialog>
      )
  }

  return (
    <>{renderComponent()}</>
  )
}

export default ManageGroupDialog;