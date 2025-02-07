'use client'

import { ConsoleLogger } from "@/lib/console.logger";
import { Meta } from "../data/meta";
import { useEffect, useRef, useState } from "react";
import { initMetaBase } from "@/data/meta";
import { UseFormReturn } from "react-hook-form";
import { dependency_policies, dependency_roles, dependency_users } from "@/data/constants";
import { AlertTableType, AlertType, CombinedType } from "@/data/types";
import { DataTable } from "@/components/datatable/data-table";
import { alertcolumns } from "@/components/ecafe/table/alert-columns";
import { Button } from "@/components/ui/button";
import { Data, fullMapNoSubjectToData } from "@/lib/mapping";
import { validateMappedData } from "@/lib/validate";
import { cloneObject, difference } from "@/lib/utils";
import { handleCreateGroup, handleUpdateGroup } from "@/lib/db";
import AlertTable from "@/components/ecafe/alert-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EcafeButton from "@/components/ecafe/ecafe-button";
import PageTitle from "@/components/ecafe/page-title";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import TabRoles from "../../components/tab-roles";
import TabPolicies from "../../components/tab-policies";
import TabGroups from "../../components/tab-groups";
import TabGroup from "./components/tab-group";
import TabUsers from "../../components/tab-users";

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

const GroupDialog = ({_open, _meta, _setReload}:{_open: boolean; _meta: Meta; _setReload(x: any): void;}) => {
  const logger = new ConsoleLogger({ level: 'debug' });

  logger.debug("GroupDialog", "IN(_open)", _open);
  logger.debug("GroupDialog", "IN(_meta)", JSON.stringify(_meta));
  logger.debug("GroupDialog", "IN(_meta.currentSubject)", JSON.stringify(_meta.currentSubject));

  // const [metaOfUserDialog, setMetaOfUserDialog] = useState<Meta>(_meta);
  const [metaOfGroupDialogState, setMetaOfGroupDialogState] = useState<Meta>(initMetaBase);

  const roleDependenciesRef = useRef<DependencyType>(initDependency);
  const policyDependenciesRef = useRef<DependencyType>(initDependency);
  const userDependenciesRef = useRef<DependencyType>(initDependency);

  const [tab, setTab] = useState<string>("group");

  const [groupTabLeaveState, setGroupTabLeaveState] = useState<boolean>(false);

  const formMethods = useRef<UseFormReturn<any>>(undefined);

  const resetDependencies = (): void => {
    roleDependenciesRef.current = initDependency;
    policyDependenciesRef.current = initDependency;
    userDependenciesRef.current = initDependency;
  }

  const clearDependencies = () => {
    logger.debug("GroupDialog", "clearDependencies");
    setTab("group");
    resetDependencies();
  }

  const calculateDependencies = (type: string, group: NewGroupType | undefined): DependencyType => {
    let result: DependencyType = {
      initialised: true,
      original: [],
      selected: []
    }

    logger.debug("GroupDialog", "calculateDependencies", type);

    if (type === dependency_roles) {
      logger.debug("GroupDialog", "calculateDependencies FOR ROLES");
      result.selected = [];
      logger.debug("GroupDialog", "calculateDependencies FOR ROLES1", JSON.stringify(group));
      logger.debug("UserDialog", "calculateDependencies FOR ROLES2", JSON.stringify(group?.roles));
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

    logger.debug("GroupDialog", "Dependencies", JSON.stringify(result));

    return result;
  }

  const setSelectedDependencies = (type: string, data: CombinedType[]) => {
    logger.debug("GroupDialog", "setSelectedDependencies", type, JSON.stringify(data));
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
    logger.debug("GroupDialog", "getSelectedDependencies", type);
    if (type === dependency_roles) {
      logger.debug("GroupDialog", "getSelectedDependencies", JSON.stringify(roleDependenciesRef.current.selected));
      return roleDependenciesRef.current.selected;
    }

    if (type === dependency_policies) {
      logger.debug("GroupDialog", "getSelectedDependencies", JSON.stringify(policyDependenciesRef.current.selected));
      return policyDependenciesRef.current.selected;
    }

    if (type === dependency_users) {
      logger.debug("GroupDialog", "getSelectedDependencies", JSON.stringify(userDependenciesRef.current.selected));
      return userDependenciesRef.current.selected;
    }
  }
  
  const calculateValidationItems = (): number => {
    let result: number = 0;

    result += roleDependenciesRef.current.selected.length;
    result += policyDependenciesRef.current.selected.length;

    userDependenciesRef.current.selected.forEach((user: NewUserType) => {
      if (user.roles) {
        result += user.roles.length;
      }

      if (user.policies) {
        result += user.policies.length;
      }
    });

    return result;
  }

  const [alert, setAlert] = useState<AlertType>();
  
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

  const [valid, setValid] = useState<boolean>(false);

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
    logger.debug("GroupDialog", "UseEffect[metaOfGroupDialogRef.current]", JSON.stringify(_meta.currentSubject));

    if (_open) {
      logger.debug("GroupDialog", "UseEffect[_meta]", "set role dependencies", JSON.stringify(roleDependenciesRef.current));
      if (!roleDependenciesRef.current.initialised) {
        roleDependenciesRef.current = calculateDependencies(dependency_roles, _meta.currentSubject as NewGroupType);
      }

      logger.debug("GroupDialog", "UseEffect[_meta]", "set policy dependencies");
      if (!policyDependenciesRef.current.initialised) {
        policyDependenciesRef.current = calculateDependencies(dependency_policies, _meta.currentSubject as NewGroupType);
      }

      logger.debug("GroupDialog", "UseEffect[_meta]", "set user dependencies");
      if (!userDependenciesRef.current.initialised) {
        userDependenciesRef.current = calculateDependencies(dependency_users, _meta.currentSubject as NewGroupType);
      }

      logger.debug("GroupDialog", "ROLE DEPENDENCIES", JSON.stringify(roleDependenciesRef.current));
      logger.debug("GroupDialog", "POLICY DEPENDENCIES", JSON.stringify(policyDependenciesRef.current));
      logger.debug("GroupDialog", "USER DEPENDENCIES", JSON.stringify(userDependenciesRef.current));
    }

    logger.debug("GroupDialog", "UseEffect", "setMetaOfGroupDialog => TR");

    _meta.control.clearDependencies = clearDependencies;
    _meta.control.setSelection = setSelectedDependencies;
    _meta.control.getSelection = getSelectedDependencies;
    _meta.control.calculateValidationItems = calculateValidationItems;
    _meta.subject.validateSubject = validateGroup;
    _meta.subject.getValidationResult = getValidationResult;

    setMetaOfGroupDialogState(_meta);
  }, [_meta]);

  const onTabChange = (newtab: string) => {
    logger.debug("GroupDialog", "onTabChange", newtab);
    if (tab === "group") {
      logger.debug("GroupDialog", "onTabChange", "OLDTAB is GROUP");
      logger.debug("GroupDialog", "onTabChange", "seGroupTabLeave(true) => TR");
      setGroupTabLeaveState(true);
    } else {
      logger.debug("GroupDialog", "onTabChange", "OLDTAB is not GROUP");
      logger.debug("GroupDialog", "onTabChange", "setGroupTabLeave(false) => TR");
      setGroupTabLeaveState(false);
    }

    logger.debug("GroupDialog", "onTabChange", "NEW TABBIE", newtab);
    setTab(newtab);
  }

  const handleInvalidForm = () => {
    setTab("group");
  }

  type ApiType = {
    id: number
  }

  type ItemType = {
    selected?: ApiType[],
    removed?: ApiType[],
  }

  const prepareGroup = (data: any, selectedGroup?: NewGroupType): NewExtendedGroupType => {
    let group: NewExtendedGroupType = {
      id: (selectedGroup ? selectedGroup.id : 0),
      name: data.name,
      description: data.description,
      roles: {
      },
      policies: {
      },
      users: {
      }
    }

    let roles: ItemType = {
    }

    const originalRoles: ApiType[] = roleDependenciesRef.current.original?.map((_role) => {
        let role: ApiType = {
          id: _role.id,
        }

        return role;
    });
    logger.debug("GroupDialog", "PrepareGroup(Original Roles)", JSON.stringify(originalRoles));

    const selectedRoles: ApiType[] = roleDependenciesRef.current.selected?.map((_role) => {
      let role: ApiType = {
        id: _role.id,
      }

      return role;
    });
    logger.debug("GroupDialog", "PrepareGroup(Selected Roles)", JSON.stringify(selectedRoles));

    const diffRoles: number[] = difference(roleDependenciesRef.current.original, roleDependenciesRef.current.selected);
    logger.debug("GroupDialog", "PrepareGroup(diffRoles)", JSON.stringify(diffRoles));

    const removedRoles: ApiType[] = diffRoles.map(_id => {
      let role: ApiType = {
        id: _id
      }

      return role;
    });
    logger.debug("GroupDialog", "PrepareGroup(removedRoles)", JSON.stringify(removedRoles));

    if (selectedRoles.length > 0) {
      roles.selected = selectedRoles;
    }

    if (removedRoles.length > 0) {
      roles.removed = removedRoles;
    }
    
    group.roles = roles;

    let policies: ItemType = {
    }

    const originalPolicies: ApiType[] = policyDependenciesRef.current.original?.map((_policy) => {
        let policy: ApiType = {
          id: _policy.id,
        }

        return policy;
    });
    logger.debug("GroupDialog", "PrepareGroup(Original Policies)", JSON.stringify(originalPolicies));

    const selectedPolicies: ApiType[] = policyDependenciesRef.current.selected?.map((_policy) => {
      let policy: ApiType = {
        id: _policy.id,
      }

      return policy;
    });
    logger.debug("GroupDialog", "PrepareGroup(Selected Policies)", JSON.stringify(selectedPolicies));

    const diffPolicies: number[] = difference(policyDependenciesRef.current.original, policyDependenciesRef.current.selected);
    logger.debug("GroupDialog", "PrepareGroup(diffPolicies)", JSON.stringify(diffPolicies));

    const removedPolicies: ApiType[] = diffPolicies.map(_id => {
      let policy: ApiType = {
        id: _id
      }

      return policy;
    });

    logger.debug("GroupDialog", "PrepareGroup(removedPolicies)", JSON.stringify(removedPolicies));

    if (selectedPolicies.length > 0) {
      policies.selected = selectedPolicies;
    }

    if (removedPolicies.length > 0) {
      policies.removed = removedPolicies;
    }
    
    group.policies = policies;

    let users: ItemType = {
    }

    const originalUsers: ApiType[] = userDependenciesRef.current.original?.map((_user) => {
        let user: ApiType = {
          id: _user.id,
        }

        return user;
    });
    logger.debug("GroupDialog", "PrepareGroup(Original Users)", JSON.stringify(originalUsers));

    const selectedUsers: ApiType[] = userDependenciesRef.current.selected?.map((_user) => {
      let user: ApiType = {
        id: _user.id,
      }

      return user;
    });
    logger.debug("GroupDialog", "PrepareGroup(Selected Users)", JSON.stringify(selectedUsers));

    const diffUsers: number[] = difference(userDependenciesRef.current.original, userDependenciesRef.current.selected);
    logger.debug("GroupDialog", "PrepareGroup(diffUsers)", JSON.stringify(diffUsers));

    const removedUsers: ApiType[] = diffUsers.map(_id => {
      let user: ApiType = {
        id: _id
      }

      return user;
    });

    logger.debug("GroupDialog", "PrepareGroup(removedUSers)", JSON.stringify(removedUsers));

    if (selectedUsers.length > 0) {
      users.selected = selectedUsers;
    }

    if (removedUsers.length > 0) {
      users.removed = removedUsers;
    }
    
    group.users = users;

    return group;
  }

  const groupCreatedCallback = () => {
    clearDependencies();
    metaOfGroupDialogState.control.handleDialogState(false);
    logger.debug("GroupDetails", "CALL RELOAD");
    _setReload((x: any) => x+1);
  }

  const groupUpdatedCallback = () => {
    clearDependencies();
    metaOfGroupDialogState.control.handleDialogState(false);
    _setReload((x: any) => x+1);
  }

  const onSubmitForm = (data: any) => {
    logger.debug("GroupDialog", "OnSubmitForm", JSON.stringify(data));

    if (metaOfGroupDialogState.currentSubject) {
      logger.debug("GroupDialog", "OnSubmitForm", "UPDATE?");
      const group: NewExtendedGroupType = prepareGroup(data, metaOfGroupDialogState.currentSubject as NewGroupType);
      logger.debug("GroupDialog", "OnSubmitForm(prepareGroup)", JSON.stringify(group));
      handleUpdateGroup(group, groupUpdatedCallback);
    } else {
      logger.debug("GroupDialog", "OnSubmitForm", "CREATE?");
      const group: NewExtendedGroupType = prepareGroup(data);
      logger.debug("GroupDialog", "OnSubmitForm(prepareGroup)", JSON.stringify(group));
      handleCreateGroup(group, groupCreatedCallback);
    }
  }

  const handleValidForm = () => {
    logger.debug("GroupDialog", "handleValidForm");
    if (formMethods.current) {
      logger.debug("GroupDialog", "Submitting form");
      const {getValues} = formMethods.current;

      onSubmitForm(getValues());
    }
  }

  const validate = async () => {
    logger.debug("GroupDialog", "VALIDATE");
    if (formMethods.current) {
      const {trigger} = formMethods.current;

      await trigger().then((valid: boolean) => {
        logger.debug("GroupDialog", "form validatation(valid)", valid);
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
      logger.debug("UserGroup", "renderComponent(_open)", _open);
      logger.debug("UserGroup", "renderComponent(groupTabLeaveState)", groupTabLeaveState);

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

    return (
        <>{renderComponent()}</>
    );
}

export default GroupDialog;