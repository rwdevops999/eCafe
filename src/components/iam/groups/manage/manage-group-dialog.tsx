'use client'

import PageTitle from "@/components/ecafe/page-title";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabGroup from "./tabs/tab-group";
import { useEffect, useRef, useState } from "react";
import EcafeButton from "@/components/ecafe/ecafe-button";
import { GroupType, PolicyType, RoleType, UserType } from "@/data/iam-scheme";
import { issuer_policies, issuer_roles, issuer_users, Meta } from "../../users/manage/tabs/data/meta";
import { AlertType, CallbackFunctionDefault } from "@/data/types";
import { createGroup, updateGroup } from "@/lib/db";
import { Data, mapPoliciesToData, mapRolesToData, mapUsersToData } from "@/lib/mapping";
import { difference } from "@/lib/utils";
import { FormSchema, FormSchemaType } from "./tabs/data/data";
import { Button } from "@/components/ui/button";
import AlertMessage from "@/components/ecafe/alert-message";
import { z } from "zod";
import TabRoles from "../../users/manage/tabs/tab-roles";
import TabPolicies from "../../users/manage/tabs/tab-policies";
import TabUsers from "../../users/manage/tabs/tab-users";

const ManageGroupDialog = ({meta, _enabled, handleReset, setReload}:{meta:Meta<FormSchemaType>; _enabled:boolean; handleReset(): void; setReload(x:any):void;}) => {
  const [metaForManageGroupDialog, setMetaForManageGroupDialog] = useState<Meta<FormSchemaType>>(meta);
  
  const originalRoles = useRef<Data[]>([]);
  const selectedRoles = useRef<Data[]>([]);

  const originalPolicies = useRef<Data[]>([]);
  const selectedPolicies = useRef<Data[]>([]);

  const originalUsers = useRef<Data[]>([]);
  const selectedUsers = useRef<Data[]>([]);

  const [open, setOpen] = useState<boolean>(false);
    
  const handleDialogState = (state: boolean) => {
    setOpen(state);
  }

  const closeDialog = () => {
    originalRoles.current = [];
    selectedRoles.current = [];
  
    originalPolicies.current = [];
    selectedPolicies.current = [];
  
    originalUsers.current = [];
    selectedUsers.current = [];

    handleDialogState(false);
    handleReset();
  }

  const [alert, setAlert] = useState<AlertType>();
  
  const handleRemoveAlert = () => {
    setAlert(undefined);
  }

  const showAlert = (_title: string, _message: string) => {
    const alert = {
      open: true,
      error: true,
      title: _title,
      message: _message,
      child: <Button className="bg-orange-400 hover:bg-orange-600" size="sm" onClick={handleRemoveAlert}>close</Button>
    };
  
    setAlert(alert);
  }

  const prepareGroup = (data: any): GroupType => {
    const roles: RoleType[] = selectedRoles.current.map(_role => {
      let role: RoleType = {
        id: _role.id,
      }

      return role;
    });

    const diffRoles: number[] = difference(originalRoles.current, selectedRoles.current);
    const removedRoles: RoleType[] = diffRoles.map(_id => {
      let role: RoleType = {
        id: _id
      }

      return role;
    });

    const policies: PolicyType[] = selectedPolicies.current.map(_policy => {
      let policy: PolicyType = {
        id: _policy.id,
      }

      return policy;
    });

    const diffPolicies: number[] = difference(originalPolicies.current, selectedPolicies.current);
    const removedPolicies: PolicyType[] = diffPolicies.map(_id => {
      let policy: PolicyType = {
        id: _id
      }

      return policy;
    });

    const users: UserType[] = selectedUsers.current.map(_user => {
      let user: UserType = {
        id: _user.id,
      }

      return user;
    });

    const diffUsers: number[] = difference(originalUsers.current, selectedUsers.current);
    const removedUsers: UserType[] = diffUsers.map(_id => {
      let user: UserType = {
        id: _id
      }

      return user;
    });

    return {
      id: (metaForManageGroupDialog.subject ? metaForManageGroupDialog.subject.id : 0),
      name: data.name,
      description: data.description,
      roles: {
        original: [],
        selected: roles,
        removed: removedRoles
      },
      policies: {
        original: [],
        selected: policies,
        removed: removedPolicies
      },
      users: {
        original: [],
        selected: users,
        removed: removedUsers
      }
    }
  }

  const groupChangedCallback = () => {
    handleDialogState(false);
    setReload((x: any) => x+1);
  }

  const handleManageGroup = (data: any): void => {
   if  (metaForManageGroupDialog.subject) {
      const group: GroupType = prepareGroup(data);
      if  (group) {
        updateGroup(group, groupChangedCallback);
      }
    } else {
      const group: GroupType = prepareGroup(data);

      if  (group) {
        createGroup(group, groupChangedCallback);
      }
    }
    handleReset();
   }

  const setRelations = (group: GroupType|undefined): void => {
    if (group) {
      if (group.roles && group.roles.original.length > 0) {
        const mappedRoles: Data[] = mapRolesToData(group.roles.original);
        selectedRoles.current = mappedRoles
        originalRoles.current = mappedRoles;
      }

      if (group.policies && group.policies.original.length > 0) {
        const mappedPolicies: Data[] = mapPoliciesToData(group.policies.original);
        selectedPolicies.current = mappedPolicies;
        originalPolicies.current = mappedPolicies;
      }

      if (group.users && group.users.original.length > 0) {
        const mappedUsers: Data[] = mapUsersToData(group.users.original);
        selectedUsers.current = mappedUsers;
        originalUsers.current = mappedUsers;
      }
    } else {
      selectedRoles.current = [];
      selectedPolicies.current = [];
      selectedUsers.current = [];
    }
  }

  const validateFormValues = (data: FormSchemaType) => {
    try {
      const parsedData = FormSchema.parse(data);
      handleManageGroup(data);

    } catch (error) {
        if (error instanceof z.ZodError) {
          showAlert("validation failed", "Group data is not correct");
        } else {
        console.error("Unexpected error: ", error);
      }
    }
  }
  
  const handleSubmitForm = () => {
    if (metaForManageGroupDialog.form?.getValues) {
      validateFormValues(metaForManageGroupDialog.form.getValues())
    }
  }

    const setSelection = (type: string, data: Data[]) => {
      switch (type) {
        case issuer_roles:
          selectedRoles.current = data;
          break;
        case issuer_policies:
          selectedPolicies.current = data;
          break;
        case issuer_users:
          selectedUsers.current = data;
          break
      }
    }
  
    const getSelection = (type: string): Data[] => {
      if (type === issuer_roles) {
        return selectedRoles.current
      }
  
      if (type === issuer_policies) {
        return selectedPolicies.current
      }
  
      if (type === issuer_users) {
        return selectedUsers.current
      }
  
      return [];
    }
  
    const validateItems = (): boolean => {
        // const policyStatements: Data[] = getPolicyStatements(selectedPolicies.current);
        // const roleStatements: Data[] = getRoleStatements(selectedRoles.current);
    
        // const validationData: Data[] = [...policyStatements, ...roleStatements];
    
        // let validationResult: ValidationType = validateData(validationData);
    
        // if (validationResult.result === "error") {
        //   showAlert("Validation Error", validationResult.message!);
        // }
    
        // return (validationResult.result === "ok");
        return true;
    }
    
    
  useEffect(() => {
    if (metaForManageGroupDialog.subject) {
      setRelations(metaForManageGroupDialog.subject);
    } else {
      selectedRoles.current = [];
      selectedPolicies.current = [];
      selectedUsers.current = [];
    }

    meta.control ? meta.control.closeDialog = closeDialog : meta.control = {closeDialog: closeDialog};
    meta.control ? meta.control.handleSubject = handleManageGroup : meta.control = {handleSubject: handleManageGroup};
    meta.form ? meta.form.submitForm = handleSubmitForm : meta.form = {submitForm: handleSubmitForm};
    meta.sender = "ManageUserdialog";
    meta.items ? meta.items.setSelection = setSelection : meta.items = {setSelection: setSelection}
    meta.items ? meta.items.getSelection = getSelection : meta.items = {getSelection: getSelection}
    meta.items ? meta.items.validateItems = validateItems : meta.items = {validateItems: validateItems}
  
    setMetaForManageGroupDialog(meta);

    meta.changeMeta ? meta.changeMeta(meta) : (_meta: Meta<FormSchemaType>) => {}
  }, [meta.subject]);

  const renderComponent = () => {
    if (alert && alert.open) {
      return (<AlertMessage alert={alert}></AlertMessage>)
    }

    if (metaForManageGroupDialog) {
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
                <TabsTrigger value="users">🙍🏻‍♂️ Users</TabsTrigger>
              </TabsList>
              <TabsContent value="group">
                <div className="m-1 container w-[99%]">
                  <TabGroup meta={meta}/>
                </div>
              </TabsContent>
            <TabsContent value="roles">
              <div className="m-1 container w-[99%]">
              <TabRoles meta={metaForManageGroupDialog}/>
              </div>
            </TabsContent>
            <TabsContent value="policies">
              <div className="m-1 container w-[99%]">
              <TabPolicies meta={metaForManageGroupDialog} />
              </div>
            </TabsContent>
            <TabsContent value="users">
              <div className="m-1 container w-[99%]">
              <TabUsers meta={metaForManageGroupDialog}/>
              </div>
            </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )
    }

    return null;
  }

  return (
    <>{renderComponent()}</>
  )
}

export default ManageGroupDialog;