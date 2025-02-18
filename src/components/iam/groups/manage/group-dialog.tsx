'use client'

import { ConsoleLogger } from "@/lib/console.logger";
import { useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { dependency_policies, dependency_roles, dependency_users } from "@/data/constants";
import { DataTable } from "@/components/datatable/data-table";
import { alertcolumns } from "@/components/ecafe/table/alert-columns";
import { Button } from "@/components/ui/button";
import AlertTable from "@/components/ecafe/alert-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EcafeButton from "@/components/ecafe/ecafe-button";
import PageTitle from "@/components/ecafe/page-title";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import TabRoles from "../../components/tab-roles";
import TabPolicies from "../../components/tab-policies";
import TabGroup from "./components/tab-group";
import TabUsers from "../../components/tab-users";
import { Meta } from "../meta/meta";
import { AlertTableType, AlertType, CombinedType, Data, ExtendedGroupType, GroupType, UserType } from "@/types/ecafe";
import { fullMapNoSubjectToData } from "@/lib/mapping";
import { cloneObject, difference } from "@/lib/utils";
import { handleCreateGroup, handleUpdateGroup } from "@/lib/db";
import { initMetaBase } from "@/data/meta-base";
import { useDebug } from "@/hooks/use-debug";
import { validateMappedData } from "@/lib/validate";
import { ApiResponseType } from "@/types/db";

type DependencyType = {
  initialised: boolean,
  original: any[],
  selected: any[]
}

const initDependency: DependencyType = {
  initialised: false,
  original: [], 
  selected: []
};

type ApiType = {
  id: number
}

type ItemType = {
  selected?: ApiType[],
  removed?: ApiType[],
}

const GroupDialog = ({_open, _meta, _setReload}:{_open: boolean; _meta: Meta; _setReload(x: any): void;}) => {
  const {debug} = useDebug();
  
  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  // const [metaOfUserDialog, setMetaOfUserDialog] = useState<Meta>(_meta);
  const [metaOfGroupDialogState, setMetaOfGroupDialogState] = useState<Meta>(initMetaBase);

  const roleDependenciesRef = useRef<DependencyType>(initDependency);
  const policyDependenciesRef = useRef<DependencyType>(initDependency);
  const userDependenciesRef = useRef<DependencyType>(initDependency);

  const [tab, setTab] = useState<string>("group");
  const [alert, setAlert] = useState<AlertType>();
  const [valid, setValid] = useState<boolean>(false);

  const [groupTabLeaveState, setGroupTabLeaveState] = useState<boolean>(false);

  const formMethods = useRef<UseFormReturn<any>>(undefined);

  const resetDependencies = (): void => {
    roleDependenciesRef.current = initDependency;
    policyDependenciesRef.current = initDependency;
    userDependenciesRef.current = initDependency;
  }

  const clearDependencies = () => {
    setTab("group");
    resetDependencies();
  }

  const calculateDependencies = (type: string, group: GroupType | undefined): DependencyType => {
    let result: DependencyType = {
      initialised: true,
      original: [],
      selected: []
    }

    if (type === dependency_roles) {
      result.selected = [];
      if (group && group.roles) {
        result.original = group.roles;
        result.selected = group.roles;
      }
    }

    if (type === dependency_policies) {
      result.selected = [];
      if (group && group.policies) {
        result.original = group.policies;
        result.selected = group.policies;
      }
    }

    if (type === dependency_users) {
      result.selected = [];
      if (group && group.users) {
        result.original = group.users;
        result.selected = group.users;
      }
    }

    return result;
  }

  const setSelectedDependencies = (type: string, data: CombinedType[]) => {
    if (type === dependency_roles) {
      roleDependenciesRef.current.selected = data;
    }

    if (type === dependency_policies) {
      policyDependenciesRef.current.selected = data;
    }

    if (type === dependency_users) {
      userDependenciesRef.current.selected = data;
    }
  }
  
  const getSelectedDependencies = (type: string): CombinedType[]|undefined => {
    if (type === dependency_roles) {
      return roleDependenciesRef.current.selected;
    }

    if (type === dependency_policies) {
      return policyDependenciesRef.current.selected;
    }

    if (type === dependency_users) {
      return userDependenciesRef.current.selected;
    }
  }
  
  const calculateValidationItems = (): number => {
    let result: number = 0;

    result += roleDependenciesRef.current.selected.length;
    result += policyDependenciesRef.current.selected.length;

    userDependenciesRef.current.selected.forEach((user: UserType) => {
      if (user.roles) {
        result += user.roles.length;
      }

      if (user.policies) {
        result += user.policies.length;
      }
    });

    return result;
  }

  const handleRemoveAlert = () => {
    setAlert(undefined);
  }

  const showAlert = (_title: string, _message: string, data: Data[]) => {
    const alert: AlertTableType = {
      open: true,
      error: true,
      title: _title,
      message: _message,
      table: <DataTable data={data} columns={alertcolumns}/>,
      child: <Button className="bg-orange-400 hover:bg-orange-600" size="sm" onClick={handleRemoveAlert}>close</Button>
    };
  
    setAlert(alert);
  }

  const validateGroup = () => {
    const subject: {
      id: number,
      name: string;
      roles: {
        original: any[]
      },
      policies: {
        original: any[]
      }
      users: {
        original: any[]
      }
    } = {
      id : 0,
      name: "validation",
      roles: {
        original: []
      },
      policies: {
        original: []
      },
      users: {
        original: []
      },
    }
    let mappedData: Data[] = fullMapNoSubjectToData(
      subject, 
      roleDependenciesRef.current.selected,
      policyDependenciesRef.current.selected,
      userDependenciesRef.current.selected
    );

    let conflicts: Data[] = validateMappedData(mappedData);

    if (conflicts.length > 0) {
      showAlert("Validation Error", "Conflicts", conflicts);
    }

    setValid(conflicts.length === 0);
  }

  const getValidationResult = (): boolean => {
    return valid;
  }

  useEffect(() => {
    if (_open) {
      if (!roleDependenciesRef.current.initialised) {
        roleDependenciesRef.current = calculateDependencies(dependency_roles, _meta.currentSubject as GroupType);
      }

      if (!policyDependenciesRef.current.initialised) {
        policyDependenciesRef.current = calculateDependencies(dependency_policies, _meta.currentSubject as GroupType);
      }

      if (!userDependenciesRef.current.initialised) {
        userDependenciesRef.current = calculateDependencies(dependency_users, _meta.currentSubject as GroupType);
      }

    }

    _meta.control.clearDependencies = clearDependencies;
    _meta.control.setSelection = setSelectedDependencies;
    _meta.control.getSelection = getSelectedDependencies;
    _meta.control.calculateValidationItems = calculateValidationItems;
    _meta.subject.validateSubject = validateGroup;
    _meta.subject.getValidationResult = getValidationResult;

    setMetaOfGroupDialogState(_meta);
  }, [_meta]);

  const onTabChange = (newtab: string) => {
    if (tab === "group") {
      setGroupTabLeaveState(true);
    } else {
      setGroupTabLeaveState(false);
    }

    setTab(newtab);
  }

  const handleInvalidForm = () => {
    setTab("group");
  }

  const prepareGroup = (data: any, selectedGroup?: GroupType): ExtendedGroupType => {
    let group: ExtendedGroupType = {
      id: (selectedGroup ? selectedGroup.id : 0),
      name: data.name,
      description: data.description,
      roles: {},
      policies: {},
      users: {}
    }

    let roles: ItemType = {}

    const originalRoles: ApiType[] = roleDependenciesRef.current.original?.map((_role) => {return {id: _role.id}});

    const selectedRoles: ApiType[] = roleDependenciesRef.current.selected?.map((_role) => {return {id: _role.id}});

    const diffRoles: number[] = difference(roleDependenciesRef.current.original, roleDependenciesRef.current.selected);

    const removedRoles: ApiType[] = diffRoles.map(_id => {return {id: _id}});

    if (selectedRoles.length > 0) {
      roles.selected = selectedRoles;
    }

    if (removedRoles.length > 0) {
      roles.removed = removedRoles;
    }
    
    group.roles = roles;

    let policies: ItemType = {}

    const originalPolicies: ApiType[] = policyDependenciesRef.current.original?.map((_policy) => {return {id: _policy.id}});

    const selectedPolicies: ApiType[] = policyDependenciesRef.current.selected?.map((_policy) => {return {id: _policy.id}});

    const diffPolicies: number[] = difference(policyDependenciesRef.current.original, policyDependenciesRef.current.selected);

    const removedPolicies: ApiType[] = diffPolicies.map(_id => {return {id: _id}});

    if (selectedPolicies.length > 0) {
      policies.selected = selectedPolicies;
    }

    if (removedPolicies.length > 0) {
      policies.removed = removedPolicies;
    }
    
    group.policies = policies;

    let users: ItemType = {}

    const originalUsers: ApiType[] = userDependenciesRef.current.original?.map((_user) => {return {id: _user.id}});

    const selectedUsers: ApiType[] = userDependenciesRef.current.selected?.map((_user) => {return {id: _user.id}});

    const diffUsers: number[] = difference(userDependenciesRef.current.original, userDependenciesRef.current.selected);

    const removedUsers: ApiType[] = diffUsers.map(_id => {return {id: _id}});

    if (selectedUsers.length > 0) {
      users.selected = selectedUsers;
    }

    if (removedUsers.length > 0) {
      users.removed = removedUsers;
    }
    
    group.users = users;

    return group;
  }

  const groupUpsetCallback = (_data: ApiResponseType) => {
    if (_data.status === 200 || _data.status === 201) {
      clearDependencies();
      metaOfGroupDialogState.control.handleDialogState(false);
      _setReload((x: any) => x+1);
    }
  }

  const onSubmitForm = (data: any) => {
    if (metaOfGroupDialogState.currentSubject) {
      const group: ExtendedGroupType = prepareGroup(data, metaOfGroupDialogState.currentSubject as GroupType);
      handleUpdateGroup(group, groupUpsetCallback);
    } else {
      const group: ExtendedGroupType = prepareGroup(data);
      handleCreateGroup(group, groupUpsetCallback);
    }
  }

  const handleValidForm = () => {
    if (formMethods.current) {
      const {getValues} = formMethods.current;

      onSubmitForm(getValues());
    }
  }

  const validate = async () => {
    if (formMethods.current) {
      const {trigger} = formMethods.current;

      await trigger().then((valid: boolean) => {
        if (!valid) {
          handleInvalidForm();
        } else {
          handleValidForm();
        }
      })
   }
  }

  const setFormMethods = (methods: UseFormReturn<any>) => {
    formMethods.current = methods;

    setMetaOfGroupDialogState((oldValue: Meta) => {
      let newmeta: Meta = cloneObject(oldValue);
      newmeta.form = {
        validateForm: validate
      }

      return newmeta;
    })
  }

  const renderComponent = () => {
    if (alert && alert.open) {
      return (<AlertTable alert={alert}></AlertTable>)
    }

    return (
      <Dialog open={_open}>
        <DialogTrigger asChild>
          <EcafeButton id="dialogButton" className="bg-orange-400 hover:bg-orange-600 mr-3" caption="Manage group" clickHandler={_meta.control.handleDialogState} clickValue={true}/>
          {/* enabled={_enabled}/> */}
        </DialogTrigger>
        <DialogContent className="min-w-[75%]" aria-describedby="">
          <DialogHeader className="mb-2">
            <DialogTitle>
              <PageTitle title="Manage group" className="m-2 -ml-[2px]"/>
              <Separator className="bg-red-500"/>
            </DialogTitle>
          </DialogHeader>
  
          <Tabs className="w-[100%]" onValueChange={onTabChange} value={tab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="group">👨‍👦‍👦 Group</TabsTrigger>
            <TabsTrigger value="roles" >🔖 Roles</TabsTrigger>
            <TabsTrigger value="policies" >📜 Policies</TabsTrigger>
            <TabsTrigger value="users" >🙍🏻‍♂️ Users</TabsTrigger>
          </TabsList>
          {_open &&
            <>
                <TabsContent value="group" forceMount={tab !== "group" ? true : undefined} hidden={tab !== "group"}>
                    <div className="m-1 container w-[99%]">
                      <TabGroup _meta={metaOfGroupDialogState} onTabLeave={groupTabLeaveState} setFormMethods={setFormMethods}/>
                    </div>
                </TabsContent>
                <TabsContent value="roles">
                    <div className="m-1 container w-[99%]">
                      <TabRoles _meta={metaOfGroupDialogState} />
                    </div>
                </TabsContent>
                <TabsContent value="policies">
                    <div className="m-1 container w-[99%]">
                      <TabPolicies _meta={metaOfGroupDialogState} />
                    </div>
                </TabsContent>
                <TabsContent value="users">
                    <div className="m-1 container w-[99%]">
                      <TabUsers _meta={metaOfGroupDialogState} />
                    </div>
                </TabsContent>
            </>
          }
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  }

  return (<>{renderComponent()}</>);
}

export default GroupDialog;