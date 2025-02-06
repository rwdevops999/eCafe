'use client'

import EcafeButton from "@/components/ecafe/ecafe-button";
import PageTitle from "@/components/ecafe/page-title";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cloneObject, log } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Meta } from "../data/meta";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabRoles from "../../components/tab-roles";
import TabGroups from "../../components/tab-groups";
import TabPolicies from "../../components/tab-policies";
import { Button } from "@/components/ui/button";
import TabUsers from "./components/tab-users";
import { useToast } from "@/hooks/use-toast";
import { handleCreateUser } from "@/lib/db";
import { dependency_groups, dependency_policies, dependency_roles } from "@/data/constants";
import { CombinedType } from "@/data/types";
import { ConsoleLogger } from "@/lib/console.logger";
import { initMetaBase } from "@/data/meta";

const debug = true;

type DependencyType = {
  initialised: boolean,
  original?: any[],
  selected?: any[]
}

const UserDialog = ({_open, _meta}:{_open: boolean; _meta: Meta;}) => {
  const logger = new ConsoleLogger({ level: 'debug' });

  logger.debug("UserDialog", "IN(_open)", _open);
  logger.debug("UserDialog", "IN(_meta)", JSON.stringify(_meta));
  logger.debug("UserDialog", "IN(_meta.currentSubject)", JSON.stringify(_meta.currentSubject));

  // const [metaOfUserDialog, setMetaOfUserDialog] = useState<Meta>(_meta);
  const [metaOfUserDialogState, setMetaOfUserDialogState] = useState<Meta>(initMetaBase);

  const roleDependenciesRef = useRef<DependencyType>({initialised: false});
  const policyDependenciesRef = useRef<DependencyType>({initialised: false});
  const groupDependenciesRef = useRef<DependencyType>({initialised: false});

  const [tab, setTab] = useState<string>("user");

  // const [persistUser, setPeristUser] = useState<boolean>(false);
  const [userTabLeaveState, setUserTabLeaveState] = useState<boolean>(false);

  const resetDependencies = (): void => {
    const initDependency: DependencyType = {
      initialised: false,
    };

    roleDependenciesRef.current = initDependency;
    policyDependenciesRef.current = initDependency;
    groupDependenciesRef.current = initDependency;
  }

  const clearDependencies = () => {
    logger.debug("UserDialog", "clearDependencies");
    setTab("user");
    resetDependencies();
  }

  const calculateDependencies = (type: string, user: NewUserType | undefined): DependencyType => {
    let result: DependencyType = {
      initialised: true,
      original: undefined,
      selected: undefined
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
  
  useEffect(() => {
    logger.debug("UserDialog", "UseEffect[metaOfUserDialogRef.current]", JSON.stringify(_meta.currentSubject));

    if (_open) {
      logger.debug("UserDialog", "UseEffect[_meta]", "set role dependencies", JSON.stringify(roleDependenciesRef.current));
      if (!roleDependenciesRef.current.initialised) {
        roleDependenciesRef.current = calculateDependencies(dependency_roles, _meta.currentSubject as NewUserType);
      }

      logger.debug("UserDialog", "UseEffect[_meta]", "set policy dependencies");
      if (!policyDependenciesRef.current.initialised) {
        policyDependenciesRef.current = calculateDependencies(dependency_policies, _meta.currentSubject as NewUserType);
      }

      logger.debug("UserDialog", "UseEffect[_meta]", "set group dependencies");
      if (!groupDependenciesRef.current.initialised) {
        groupDependenciesRef.current = calculateDependencies(dependency_groups, _meta.currentSubject as NewUserType);
      }

      logger.debug("UserDialog", "ROLE DEPENDENCIES", JSON.stringify(roleDependenciesRef.current));
      logger.debug("UserDialog", "POLICY DEPENDENCIES", JSON.stringify(policyDependenciesRef.current));
      logger.debug("UserDialog", "GROUP DEPENDENCIES", JSON.stringify(groupDependenciesRef.current));
    }

    logger.debug("UserDialog", "UseEffect", "setMetaOfUserDialog => TR");
    _meta.control.clearDependencies = clearDependencies;
    _meta.control.setSelection = setSelectedDependencies;
    _meta.control.getSelection = getSelectedDependencies;

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

  //   const selectedRoles = useRef<NewRoleType[]>([]);
  //   const selectedPolicies = useRef<NewPolicyType[]>([]);
  //   const selectedGroups = useRef<NewGroupType[]>([]);

  //   const setSelectedDependencies = (type: string, data: CombinedType[]) => {
  //     log(debug, "UserDialog", "setSelectedDependencies", type);
  //     if (type === dependency_roles) {
  //       log(true, "UserDialog", "setSelectedRoles", data, true);
  //       selectedRoles.current = data as NewRoleType[];
  //     }

  //     if (type === dependency_policies) {
  //       log(debug, "UserDialog", "setSelectedPolicies", data, true);
  //       selectedPolicies.current = data as NewPolicyType[];
  //     }

  //     if (type === dependency_groups) {
  //       log(debug, "UserDialog", "setSelectedGroups", data, true);
  //       selectedGroups.current = data as NewGroupType[];
  //     }
  //   }

  //   const getSelectedDependencies = (type: string): CombinedType[] => {
  //     log(debug, "UserDialog", "getSelectedDependencies", type);

  //     let data: CombinedType[] = [];

  //     if (type === dependency_roles) {
  //       data = selectedRoles.current;
  //       log(true, "UserDialog", "getSelectedRoles", data, true);
  //     }

  //     if (type === dependency_policies) {
  //       data = selectedPolicies.current;
  //     }

  //     if (type === dependency_groups) {
  //       data = selectedGroups.current;
  //     }

  //     return data;
  //   }

  //   const setUser = (user: NewUserType) => {
  //     workingUser.current = user;

  //     if (user) {
  //       log(true, "UserDialog", "SET USER DEPENDENCIES");
  //       setSelectedDependencies(dependency_roles, user.roles as NewRoleType[])
  //       setSelectedDependencies(dependency_policies, user.policies as NewPolicyType[])
  //       setSelectedDependencies(dependency_groups, user.groups as NewGroupType[])
  //     }

  //     const newmeta: Meta = cloneObject(metaForUserDialog);

  //     newmeta.control.setSelection = setSelectedDependencies
  //     newmeta.control.getSelection = getSelectedDependencies
      
  //     newmeta.currentSubject = user;

  //     setMetaForUserDialog(newmeta);
  //   }

    useEffect(() => {
      logger.debug("UserDialog", "useEffect[]");
      // setUser(_meta.currentSubject as NewUserType);

      /**
       * meta set 
       * - createSubject
       * - updateSubject
       * - getSelection
       */

      // setMetaForUserDialog(_meta);
    }, []);

  // const userCreatedCallback = () => {
  //   log(debug, "UserDetails", "userCreatedCallback", "User is created");
  //   // setSelectedUser(undefined, false);

  //   log(debug, "UserDetails", "userDeletedCallback", "Reloading users");
  //   // handleLoadUsers(renderToastLoadUsers, usersLoadedCallback, closeToast);
  // }

  //   const handleManageUser = () => {
  //     // const user: NewUserType;
  //     // handleCreateUser(user, renderToastCreateUser, userCreatedCallback, closeToast);
  //   }

  //   const setDialogState = (state: boolean) => {
  //     if (state) {
  //       setTab("user");
  //     }

  //     _setDialogState(state);
  //   }

    const renderComponent = () => {
      logger.debug("UserDialog", "renderComponent(_open)", _open);
      logger.debug("UserDialog", "renderComponent(userTabLeaveState)", userTabLeaveState);
      logger.debug("UserDialog", "renderComponent(TABBIE)", tab);

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
                          <TabUsers _meta={metaOfUserDialogState} onTabLeave={userTabLeaveState}/>
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