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
  const logger = new ConsoleLogger({ level: 'debug' });

  logger.debug("UserDialog", "IN(_open)", _open);
  logger.debug("UserDialog", "IN(_meta)", JSON.stringify(_meta));
  logger.debug("UserDialog", "IN(_meta.currentSubject)", JSON.stringify(_meta.currentSubject));

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
    logger.debug("UserDialog", "clearDependencies");
    setTab("user");
    resetDependencies();
  }

  const calculateDependencies = (type: string, user: UserType|undefined): DependencyType => {
    let result: DependencyType = {
      initialised: true,
      original: [],
      selected: []
    }

    logger.debug("UserDialog", "calculateDependencies", type);

    if (type === dependency_roles) {
      logger.debug("UserDialog", "calculateDependencies FOR ROLES");
      result.selected = [];
      logger.debug("UserDialog", "calculateDependencies FOR ROLES1", JSON.stringify(user));
      logger.debug("UserDialog", "calculateDependencies FOR ROLES2", JSON.stringify(user?.roles));
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

    logger.debug("UserDialog", "Dependencies", JSON.stringify(result));

    return result;
  }

  const setSelectedDependencies = (type: string, data: CombinedType[]) => {
    logger.debug("UserDialog", "setSelectedDependencies", type, JSON.stringify(data));
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
    logger.debug("UserDialog", "getSelectedDependencies", type);
    if (type === dependency_roles) {
      logger.debug("UserDialog", "getSelectedDependencies", JSON.stringify(roleDependenciesRef.current.selected));
      return roleDependenciesRef.current.selected;
    }

    if (type === dependency_policies) {
      logger.debug("UserDialog", "getSelectedDependencies", JSON.stringify(policyDependenciesRef.current.selected));
      return policyDependenciesRef.current.selected;
    }

    if (type === dependency_groups) {
      logger.debug("UserDialog", "getSelectedDependencies", JSON.stringify(groupDependenciesRef.current.selected));
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
    logger.debug("UserDialog", "UseEffect[metaOfUserDialogRef.current]", JSON.stringify(_meta.currentSubject));

    if (_open) {
      logger.debug("UserDialog", "UseEffect[_meta]", "set role dependencies", JSON.stringify(roleDependenciesRef.current));
      if (!roleDependenciesRef.current.initialised) {
        roleDependenciesRef.current = calculateDependencies(dependency_roles, _meta.currentSubject as UserType);
      }

      logger.debug("UserDialog", "UseEffect[_meta]", "set policy dependencies");
      if (!policyDependenciesRef.current.initialised) {
        policyDependenciesRef.current = calculateDependencies(dependency_policies, _meta.currentSubject as UserType);
      }

      logger.debug("UserDialog", "UseEffect[_meta]", "set group dependencies");
      if (!groupDependenciesRef.current.initialised) {
        groupDependenciesRef.current = calculateDependencies(dependency_groups, _meta.currentSubject as UserType);
      }

      logger.debug("UserDialog", "ROLE DEPENDENCIES", JSON.stringify(roleDependenciesRef.current));
      logger.debug("UserDialog", "POLICY DEPENDENCIES", JSON.stringify(policyDependenciesRef.current));
      logger.debug("UserDialog", "GROUP DEPENDENCIES", JSON.stringify(groupDependenciesRef.current));
    }

    logger.debug("UserDialog", "UseEffect", "setMetaOfUserDialog => TR");
    _meta.control.clearDependencies = clearDependencies;
    _meta.control.setSelection = setSelectedDependencies;
    _meta.control.getSelection = getSelectedDependencies;
    _meta.control.calculateValidationItems = calculateValidationItems;
    _meta.subject.validateSubject = validateUser;
    _meta.subject.getValidationResult = getValidationResult;

    setMetaOfUserDialogState(_meta);
  }, [_meta]);

  const onTabChange = (newtab: string) => {
    logger.debug("UserDialog", "onTabChange", newtab);
    if (tab === "user") {
      logger.debug("UserDialog", "onTabChange", "OLDTAB is USER");
      logger.debug("UserDialog", "onTabChange", "setUserTabLeave(true) => TR");
      setUserTabLeaveState(true);
    } else {
      logger.debug("UserDialog", "onTabChange", "OLDTAB is not USER");
      logger.debug("UserDialog", "onTabChange", "setUserTabLeave(false) => TR");
      setUserTabLeaveState(false);
    }

    logger.debug("UserDialog", "onTabChange", "NEW TABBIE", newtab);
    setTab(newtab);
  }

  const countries = useRef<CountryType[]>([])
  const countriesLoadedCallback = (data: CountryType[]) => {
    countries.current = data;
  }

  useEffect(() => {
      logger.debug("UserDialog", "useEffect[]");
      handleLoadCountries(countriesLoadedCallback);
  }, []);

  const handleInvalidForm = () => {
    setTab("user");
  }

  const prepareUser = (data: any, selectedUser?: UserType): ExtendedUserType => {
    console.log("PREPARE USER", JSON.stringify(data));

    const _country: CountryType = countries.current.find((country) => country.name === data.country)!;
    logger.debug("UserDialog", "PrepareUser(country)", JSON.stringify(_country));

    let user: ExtendedUserType = {
      id: (selectedUser ? selectedUser.id : 0),
      name: data.name,
      firstname: data.firstname,
      phone: data.phone,
      email: data.email,
      password: data.password,
      passwordless: data.passwordless,
      OTP: "",
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
    logger.debug("UserDialog", "PrepareUser(Original Roles)", JSON.stringify(originalRoles));

    const selectedRoles: ApiType[] = roleDependenciesRef.current.selected?.map((_role) => {return {id: _role.id}});
    logger.debug("UserDialog", "PrepareUser(Selected Roles)", JSON.stringify(selectedRoles));

    const diffRoles: number[] = difference(roleDependenciesRef.current.original, roleDependenciesRef.current.selected);
    logger.debug("UserDialog", "PrepareUser(diffRoles)", JSON.stringify(diffRoles));

    const removedRoles: ApiType[] = diffRoles.map(_id => {return {id: _id}});
    logger.debug("UserDialog", "PrepareUser(removedRoles)", JSON.stringify(removedRoles));

    if (selectedRoles.length > 0) {
      roles.selected = selectedRoles;
    }

    if (removedRoles.length > 0) {
      roles.removed = removedRoles;
    }
    
    user.roles = roles;

    let policies: ItemType = {}

    const originalPolicies: ApiType[] = policyDependenciesRef.current.original?.map((_policy) => {return {id: _policy.id}});
    logger.debug("UserDialog", "PrepareUser(Original Policies)", JSON.stringify(originalPolicies));

    const selectedPolicies: ApiType[] = policyDependenciesRef.current.selected?.map((_policy) => {return {id: _policy.id}});
    logger.debug("UserDialog", "PrepareUser(Selected Policies)", JSON.stringify(selectedPolicies));

    const diffPolicies: number[] = difference(policyDependenciesRef.current.original, policyDependenciesRef.current.selected);
    logger.debug("UserDialog", "PrepareUser(diffPolicies)", JSON.stringify(diffPolicies));

    const removedPolicies: ApiType[] = diffPolicies.map(_id => {return {id: _id}});
    logger.debug("UserDialog", "PrepareUser(removedPolicies)", JSON.stringify(removedPolicies));

    if (selectedPolicies.length > 0) {
      policies.selected = selectedPolicies;
    }

    if (removedPolicies.length > 0) {
      policies.removed = removedPolicies;
    }
    
    user.policies = policies;

    let groups: ItemType = {}

    const originalGroups: ApiType[] = groupDependenciesRef.current.original?.map((_group) => {return {id: _group.id}});
    logger.debug("UserDialog", "PrepareUser(Original Groups)", JSON.stringify(originalGroups));

    const selectedGroups: ApiType[] = groupDependenciesRef.current.selected?.map((_group) => {return {id: _group.id}});
    logger.debug("UserDialog", "PrepareUser(Selected Groups)", JSON.stringify(selectedGroups));

    const diffGroups: number[] = difference(groupDependenciesRef.current.original, groupDependenciesRef.current.selected);
    logger.debug("UserDialog", "PrepareUser(diffGroups)", JSON.stringify(diffGroups));

    const removedGroups: ApiType[] = diffGroups.map(_id => {return {id: _id}});
    logger.debug("UserDialog", "PrepareUser(removedGroups)", JSON.stringify(removedGroups));

    if (selectedGroups.length > 0) {
      groups.selected = selectedGroups;
    }

    if (removedGroups.length > 0) {
      groups.removed = removedGroups;
    }
    
    user.groups = groups;

    return user;
  }

  const userUpsetCallback = () => {
    clearDependencies();
    metaOfUserDialogState.control.handleDialogState(false);
    logger.debug("UserDetails", "CALL RELOAD");
    _setReload((x: any) => x+1);
  }

  const onSubmitForm = (data: any) => {
    logger.debug("UserDialog", "OnSubmitForm", JSON.stringify(data));

    if (metaOfUserDialogState.currentSubject) {
      logger.debug("UserDialog", "OnSubmitForm", "UPDATE?");
      const user: ExtendedUserType = prepareUser(data, metaOfUserDialogState.currentSubject as UserType);
      logger.debug("UserDialog", "OnSubmitForm(prepareUser)", JSON.stringify(user));
      handleUpdateUser(user, userUpsetCallback);
    } else {
      logger.debug("UserDialog", "OnSubmitForm", "CREATE?");
      const user: ExtendedUserType = prepareUser(data);
      logger.debug("UserDialog", "OnSubmitForm(prepareUser)", JSON.stringify(user));
      handleCreateUser(user, userUpsetCallback);
    }
  }

  const handleValidForm = () => {
    logger.debug("UserDialog", "handleValidForm");
    if (formMethods.current) {
      logger.debug("UserDialog", "Submitting form");
      const {getValues} = formMethods.current;

      onSubmitForm(getValues());
    }
  }

  const validate = async () => {
    logger.debug("UserDialog", "VALIDATE");
    if (formMethods.current) {
      const {trigger} = formMethods.current;

      await trigger().then((valid: boolean) => {
        logger.debug("UserDialog", "form validatation(valid)", valid);
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
      logger.debug("UserDialog", "renderComponent(_open)", _open);
      logger.debug("UserDialog", "renderComponent(userTabLeaveState)", userTabLeaveState);

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