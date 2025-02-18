'use client'

import EcafeButton from "@/components/ecafe/ecafe-button";
import PageTitle from "@/components/ecafe/page-title";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cloneObject, difference } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabRoles from "../../components/tab-roles";
import TabGroups from "../../components/tab-groups";
import TabPolicies from "../../components/tab-policies";
import { dependency_groups, dependency_policies, dependency_roles } from "@/data/constants";
import { ConsoleLogger } from "@/lib/console.logger";
import { UseFormReturn } from "react-hook-form";
import { DataTable } from "@/components/datatable/data-table";
import { alertcolumns } from "@/components/ecafe/table/alert-columns";
import { Button } from "@/components/ui/button";
import AlertTable from "@/components/ecafe/alert-table";
import TabUser from "./components/tab-user";
import { Meta } from "../meta/meta";
import { AlertTableType, AlertType, CombinedType, CountryType, Data, ExtendedUserType, GroupType, UserType } from "@/types/ecafe";
import { fullMapNoSubjectToData } from "@/lib/mapping";
import { handleCreateUser, handleLoadCountries, handleUpdateUser } from "@/lib/db";
import { initMetaBase } from "@/data/meta-base";
import { validateMappedData } from "@/lib/validate";
import { useDebug } from "@/hooks/use-debug";
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

const UserDialog = ({_open, _meta, _setReload}:{_open: boolean; _meta: Meta; _setReload(x: any): void;}) => {
  const {debug} = useDebug();

  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  // const [metaOfUserDialog, setMetaOfUserDialog] = useState<Meta>(_meta);
  const [metaOfUserDialogState, setMetaOfUserDialogState] = useState<Meta>(initMetaBase);

  const roleDependenciesRef = useRef<DependencyType>(initDependency);
  const policyDependenciesRef = useRef<DependencyType>(initDependency);
  const groupDependenciesRef = useRef<DependencyType>(initDependency);

  const [tab, setTab] = useState<string>("user");
  const [alert, setAlert] = useState<AlertType>();
  const [valid, setValid] = useState<boolean>(false);

  const [userTabLeaveState, setUserTabLeaveState] = useState<boolean>(false);

  const formMethods = useRef<UseFormReturn<any>>(undefined);

  const resetDependencies = (): void => {
    roleDependenciesRef.current = initDependency;
    policyDependenciesRef.current = initDependency;
    groupDependenciesRef.current = initDependency;
  }

  const clearDependencies = () => {
    setTab("user");
    resetDependencies();
  }

  const calculateDependencies = (type: string, user: UserType|undefined): DependencyType => {
    let result: DependencyType = {
      initialised: true,
      original: [],
      selected: []
    }

    if (type === dependency_roles) {
      result.selected = [];
      if (user && user.roles) {
        result.original = user.roles;
        result.selected = user.roles;
      }
    }

    if (type === dependency_policies) {
      result.selected = [];
      if (user && user.policies) {
        result.original = user.policies;
        result.selected = user.policies;
      }
    }

    if (type === dependency_groups) {
      result.selected = [];
      if (user && user.groups) {
        result.original = user.groups;
        result.selected = user.groups;
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

    if (type === dependency_groups) {
      groupDependenciesRef.current.selected = data;
    }
  }
  
  const getSelectedDependencies = (type: string): CombinedType[]|undefined => {
    if (type === dependency_roles) {
      return roleDependenciesRef.current.selected;
    }

    if (type === dependency_policies) {
      return policyDependenciesRef.current.selected;
    }

    if (type === dependency_groups) {
      return groupDependenciesRef.current.selected;
    }
  }
  
  const calculateValidationItems = (): number => {
    let result: number = 0;

    result += roleDependenciesRef.current.selected.length;
    result += policyDependenciesRef.current.selected.length;

    groupDependenciesRef.current.selected.forEach((group: GroupType) => {
      if (group.roles) {
        result += group.roles.length;
      }

      if (group.policies) {
        result += group.policies.length;
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

  const validateUser = () => {
    const subject: {
      id: number,
      name: string;
      roles: {
        original: any[]
      },
      policies: {
        original: any[]
      }
      groups: {
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
      groups: {
        original: []
      },
    }
    let mappedData: Data[] = fullMapNoSubjectToData(
      subject, 
      roleDependenciesRef.current.selected,
      policyDependenciesRef.current.selected,
      groupDependenciesRef.current.selected
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
        roleDependenciesRef.current = calculateDependencies(dependency_roles, _meta.currentSubject as UserType);
      }

      if (!policyDependenciesRef.current.initialised) {
        policyDependenciesRef.current = calculateDependencies(dependency_policies, _meta.currentSubject as UserType);
      }

      if (!groupDependenciesRef.current.initialised) {
        groupDependenciesRef.current = calculateDependencies(dependency_groups, _meta.currentSubject as UserType);
      }

    }

    _meta.control.clearDependencies = clearDependencies;
    _meta.control.setSelection = setSelectedDependencies;
    _meta.control.getSelection = getSelectedDependencies;
    _meta.control.calculateValidationItems = calculateValidationItems;
    _meta.subject.validateSubject = validateUser;
    _meta.subject.getValidationResult = getValidationResult;

    setMetaOfUserDialogState(_meta);
  }, [_meta]);

  const onTabChange = (newtab: string) => {
    if (tab === "user") {
      setUserTabLeaveState(true);
    } else {
      setUserTabLeaveState(false);
    }

    setTab(newtab);
  }

  const countries = useRef<CountryType[]>([])
  const countriesLoadedCallback = (data: ApiResponseType): void => {
    if (data.status === 200) {
      countries.current = data.payload;
    }
  }

  useEffect(() => {
      handleLoadCountries(countriesLoadedCallback);
  }, []);

  const handleInvalidForm = () => {
    setTab("user");
  }

  const prepareUser = (data: any, selectedUser?: UserType): ExtendedUserType => {
    const _country: CountryType = countries.current.find((country) => country.name === data.country)!;

    let user: ExtendedUserType = {
      id: (selectedUser ? selectedUser.id : 0),
      name: data.name,
      firstname: data.firstname,
      phone: data.phone,
      email: data.email,
      password: data.password,
      passwordless: data.passwordless,
      blocked: data.blocked,
      address: {
        id: (selectedUser ? selectedUser.address?.id! : 0),
        street: data.street,
        number: data.number,
        box: data.box,
        city: data.city,
        postalcode: data.postalcode,
        county: data.county,
        country: _country
      },
      roles: {
      },
      policies: {
      },
      groups: {
      }
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
    
    user.roles = roles;

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
    
    user.policies = policies;

    let groups: ItemType = {}

    const originalGroups: ApiType[] = groupDependenciesRef.current.original?.map((_group) => {return {id: _group.id}});

    const selectedGroups: ApiType[] = groupDependenciesRef.current.selected?.map((_group) => {return {id: _group.id}});

    const diffGroups: number[] = difference(groupDependenciesRef.current.original, groupDependenciesRef.current.selected);

    const removedGroups: ApiType[] = diffGroups.map(_id => {return {id: _id}});

    if (selectedGroups.length > 0) {
      groups.selected = selectedGroups;
    }

    if (removedGroups.length > 0) {
      groups.removed = removedGroups;
    }
    
    user.groups = groups;

    return user;
  }

  const userUpsetCallback = (_data: ApiResponseType) => {
    if (_data.status === 200 || _data.status === 201) {
      clearDependencies();
      metaOfUserDialogState.control.handleDialogState(false);
      _setReload((x: any) => x+1);
    }
  }

  const onSubmitForm = (data: any) => {
    if (metaOfUserDialogState.currentSubject) {
      const user: ExtendedUserType = prepareUser(data, metaOfUserDialogState.currentSubject as UserType);
      handleUpdateUser(user, userUpsetCallback);
    } else {
      const user: ExtendedUserType = prepareUser(data);
      handleCreateUser(user, userUpsetCallback);
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
      const {trigger, formState: {errors}} = formMethods.current;

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

    setMetaOfUserDialogState((oldValue: Meta) => {
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
              <EcafeButton id="dialogButton" className="bg-orange-400 hover:bg-orange-600 mr-3" caption="Manage user" clickHandler={_meta.control.handleDialogState} clickValue={true}/>
              {/* enabled={_enabled}/> */}
            </DialogTrigger>
            <DialogContent className="min-w-[75%]" aria-describedby="">
              <DialogHeader className="mb-2">
                <DialogTitle>
                  <PageTitle title="Manage user" className="m-2 -ml-[2px]"/>
                  <Separator className="bg-red-500"/>
                </DialogTitle>
              </DialogHeader>
      
              <Tabs className="w-[100%]" onValueChange={onTabChange} value={tab}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="user">🙍🏻‍♂️ User</TabsTrigger>
                <TabsTrigger value="roles" >🔖 Roles</TabsTrigger>
                <TabsTrigger value="policies" >📜 Policies</TabsTrigger>
                <TabsTrigger value="groups" >👨‍👦‍👦 Groups</TabsTrigger>
              </TabsList>
              {_open &&
                <>
                    <TabsContent value="user" forceMount={tab !== "user" ? true : undefined} hidden={tab !== "user"}>
                        <div className="m-1 container w-[99%]">
                          <TabUser _meta={metaOfUserDialogState} onTabLeave={userTabLeaveState} setFormMethods={setFormMethods}/>
                        </div>
                    </TabsContent>
                    <TabsContent value="roles">
                        <div className="m-1 container w-[99%]">
                          <TabRoles _meta={metaOfUserDialogState} />
                        </div>
                    </TabsContent>
                    <TabsContent value="policies">
                        <div className="m-1 container w-[99%]">
                          <TabPolicies _meta={metaOfUserDialogState} />
                        </div>
                    </TabsContent>
                    <TabsContent value="groups">
                        <div className="m-1 container w-[99%]">
                          <TabGroups _meta={metaOfUserDialogState} />
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

export default UserDialog