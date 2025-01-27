'use client'

import PageTitle from "@/components/ecafe/page-title";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useRef, useState } from "react";
import EcafeButton from "@/components/ecafe/ecafe-button";
import { GroupType, PolicyType, RoleType, UserType } from "@/data/iam-scheme";
import { AlertTableType, AlertType, CallbackFunctionDefault } from "@/data/types";
import { createGroup, loadDependencies, updateGroup } from "@/lib/db";
import { Data, fullMapSubjectToData, mapPoliciesToData, mapRolesToData, mapUsersToData } from "@/lib/mapping";
import { difference, log } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import AlertMessage from "@/components/ecafe/alert-message";
import { z } from "zod";
import { FormSchema, FormSchemaType, Meta } from "./tabs/data/meta";
import { issuer_policies, issuer_roles, issuer_users } from "@/data/meta";
import { DataTable } from "@/components/datatable/data-table";
import { alertcolumns } from "@/components/ecafe/table/alert-columns";
import { validateMappedData } from "@/lib/validate";
import AlertTable from "@/components/ecafe/alert-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import TabRoles from "../../components/tabs/tab-roles";
import TabPolicies from "../../components/tabs/tab-policies";
import TabUsers from "../../components/tabs/tab-users";
import TabGroup from "./tabs/tab-group";

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

  const [valid, setValid] = useState<boolean>(false);

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

    log(false, "MGD", "prepareGroup[roles]", roles, true);
    log(false, "MGD", "prepareGroup[removedRoles]", removedRoles, true);
    log(false, "MGD", "prepareGroup[policies]", policies, true);
    log(false, "MGD", "prepareGroup[removedPolicies]", removedPolicies, true);
    log(false, "MGD", "prepareGroup[users]", users, true);
    log(false, "MGD", "prepareGroup[removedUsers]", removedUsers, true);

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
          showSimpleAlert("validation failed", "User data is not correct");
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
    meta.sender = "ManageGroupdialog";
    meta.items ? meta.items.setSelection = setSelection : meta.items = {setSelection: setSelection}
    meta.items ? meta.items.getSelection = getSelection : meta.items = {getSelection: getSelection}
    meta.items ? meta.items.validateItems = validateItems : meta.items = {validateItems: validateItems}
  
    setMetaForManageGroupDialog(meta);
    
    meta.changeMeta ? meta.changeMeta(meta) : (_meta: Meta<FormSchemaType>) => {}
  }, [meta.subject]);

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

  const [simpleAlert, setSimpleAlert] = useState<AlertType>();
  const [tableAlert, setTableAlert] = useState<AlertType>();
  
  const handleRemoveAlert = () => {
    setSimpleAlert(undefined);
    setTableAlert(undefined);
  }

  const showSimpleAlert = (_title: string, _message: string) => {
    const alert = {
      open: true,
      error: true,
      title: _title,
      message: _message,
      child: <Button className="bg-orange-400 hover:bg-orange-600" size="sm" onClick={handleRemoveAlert}>close</Button>
    };
  
    setSimpleAlert(alert);
  }

  const showTableAlert = (_title: string, _message: string, data: Data[]) => {
    const alert: AlertTableType = {
        open: true,
        error: true,
        title: _title,
        message: _message,
        table: <DataTable data={data} columns={alertcolumns}/>,
        child: <Button className="bg-orange-400 hover:bg-orange-600" size="sm" onClick={handleRemoveAlert}>close</Button>
    };
    
    setTableAlert(alert);
  }

  const validateSubject = (subject: any) => {
    const mappedSubject: Data[] = fullMapSubjectToData(subject);
    const conflicts = validateMappedData(mappedSubject);

    if (conflicts.length > 0) {
      showTableAlert("Validation Error", "Conflicts", conflicts);
    }

    setValid(conflicts.length === 0);
  }

  const dependencyPoliciesLoadedCallback = (subject: any, data: any[]) => {
      subject.policies.original = data;

      validateSubject(subject);
  }
  
  const dependencyRolesLoadedCallback = (subject: any, data: any[]) => {
    subject.roles.original = data;

    if (subject.policies && subject.policies.selected && subject.policies.selected.length > 0) {
      loadDependencies(subject, "http://localhost:3000/api/iam/policies/dependencies", subject.policies.selected, dependencyPoliciesLoadedCallback);
    } else {
      validateSubject(subject);
    }
  }

  const validateItems = (): boolean => {
    let group: GroupType = meta.subject;
    if (group === undefined) {
      if (metaForManageGroupDialog.form && metaForManageGroupDialog.form.getValues) {
        group = prepareGroup(metaForManageGroupDialog.form.getValues());

        if (group.roles && group.roles.selected && group.roles.selected.length > 0) {
          loadDependencies(group, "http://localhost:3000/api/iam/roles/dependencies", group.roles.selected, dependencyRolesLoadedCallback);
        } else if (group.policies && group.policies.selected && group.policies.selected.length > 0) {
          loadDependencies(group, "http://localhost:3000/api/iam/policies/dependencies", group.policies.selected, dependencyPoliciesLoadedCallback);
        }
      }
    }

    return valid;
  }

  const renderComponent = () => {
    if (simpleAlert && simpleAlert.open) {
      return (<AlertMessage alert={simpleAlert}></AlertMessage>)
    }
    if (tableAlert && tableAlert.open) {
      return (<AlertTable alert={tableAlert}></AlertTable>)
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
              <TabRoles<FormSchemaType> meta={metaForManageGroupDialog}/>
              </div>
            </TabsContent>
            <TabsContent value="policies">
              <div className="m-1 container w-[99%]">
              <TabPolicies<FormSchemaType> meta={metaForManageGroupDialog} />
              </div>
            </TabsContent>
            <TabsContent value="users">
              <div className="m-1 container w-[99%]">
              <TabUsers<FormSchemaType> meta={metaForManageGroupDialog}/>
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