'use client'

import EcafeButton from "@/components/ecafe/ecafe-button";
import PageTitle from "@/components/ecafe/page-title";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useEffect, useRef, useState } from "react";
import TabUserDetails from "./tabs/tab-user-details";
import TabRoles from "./tabs/tab-roles";
import TabPolicies from "./tabs/tab-policies";
import TabGroups from "./tabs/tab-groups";
import { FormSchema, FormSchemaType, issuer_groups, issuer_policies, issuer_roles, Meta } from "./tabs/data/meta";
import { difference, log } from "@/lib/utils";
import { AlertType } from "@/data/types";
import { CountryType, defaultCountry, GroupType, PolicyType, RoleType, UserType } from "@/data/iam-scheme";
import { Data, mapGroupsToData, mapPoliciesToData, mapRolesToData, mapUsersToData } from "@/lib/mapping";
import { getPolicyStatements, getRoleStatements, validateData, ValidationType } from "@/lib/validate";
import { Button } from "@/components/ui/button";
import { createUser, handleLoadCountries, updateUser } from "@/lib/db";
import { FieldValues, UseFormGetValues } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import AlertMessage from "@/components/ecafe/alert-message";
import { Mail } from "lucide-react";

const ManageUserDialog = ({meta, _enabled, handleReset, setReload}:{meta: Meta; _enabled:boolean; handleReset(): void; setReload(x:any):void;}) => {
  const [selectedUser, setSelectedUser] = useState<UserType>();
  const [metaForManageUserDialog, setMetaForManageUserDialog] = useState<Meta>(meta);

  const originalRoles = useRef<Data[]>([]);
  const selectedRoles = useRef<Data[]>([]);

  const originalPolicies = useRef<Data[]>([]);
  const selectedPolicies = useRef<Data[]>([]);

  const originalGroups = useRef<Data[]>([]);
  const selectedGroups = useRef<Data[]>([]);

  const country = useRef<CountryType|undefined>(undefined);

  /**
   * state of the dialog
   */
  const [open, setOpen] = useState<boolean>(false);

  const handleDialogState = (state: boolean) => {
    setOpen(state);
  }

  const closeDialog = () => {
    log(true, "MUD", "Closing Dialog");

    originalRoles.current = [];
    selectedRoles.current = [];
  
    originalPolicies.current = [];
    selectedPolicies.current = [];
  
    originalGroups.current = [];
    selectedGroups.current = [];
  
    handleDialogState(false);
    handleReset();
  }

  const prepareUser = (data: any): UserType => {
    log(true, "ManageUserDialog", "prepareUser[originalRoles]", originalRoles.current, true);
    log(true, "ManageUserDialog", "prepareUser[selectedRoles]", selectedRoles.current, true);
    log(true, "ManageUserDialog", "prepareUser[originalPolicies]", originalPolicies.current, true);
    log(true, "ManageUserDialog", "prepareUser[selectedPolicies]", selectedPolicies.current, true);
    log(true, "ManageUserDialog", "prepareUser[originalGroups]", originalGroups.current, true);
    log(true, "ManageUserDialog", "prepareUser[selectedGroups]", selectedGroups.current, true);

    const roles: RoleType[] = selectedRoles.current.map(_role => {
      let role: RoleType = {
        id: _role.id,
      }

      return role;
    });

    const diffRoles: number[] = difference(originalRoles.current, selectedRoles.current);
    log(true, "ManageUserDialog", "prepareUser[diffRoles]", diffRoles, true);
    const removedRoles: PolicyType[] = diffRoles.map(_id => {
      let role: RoleType = {
        id: _id
      }

      return role;
    });
    log(true, "ManageUserDialog", "prepareUser[removedRoles]", removedRoles, true);

    const policies: PolicyType[] = selectedPolicies.current.map(_policy => {
      let policy: PolicyType = {
        id: _policy.id,
      }

      return policy;
    });

    const diffPolicies: number[] = difference(originalPolicies.current, selectedPolicies.current);
    log(true, "ManageUserDialog", "prepareUser[diffPolicies]", diffPolicies, true);
    const removedPolicies: PolicyType[] = diffPolicies.map(_id => {
      let policy: PolicyType = {
        id: _id
      }

      return policy;
    });
    log(true, "ManageUserDialog", "prepareUser[removedPolicies]", removedPolicies, true);

    const groups: GroupType[] = selectedGroups.current.map(_group => {
      let group: GroupType = {
        id: _group.id,
      }

      return group;
    });

    const diffGroups: number[] = difference(originalGroups.current, selectedGroups.current);
    log(true, "ManageUserDialog", "prepareUser[diffGroups]", diffGroups, true);
    const removedGroups: GroupType[] = diffGroups.map(_id => {
      let group: GroupType = {
        id: _id
      }

      return group;
    });
    log(true, "ManageUserDialog", "prepareUser[removedGroups]", removedGroups, true);

    return {
      id: (metaForManageUserDialog.user ? metaForManageUserDialog.user.id : 0),
      name: data.name,
      firstname: data.firstname,
      phone: data.phone,
      phonecode: `(${country.current?.dialCode})`,
      email: data.email,
      password: data.password,
      address: {
        id: (metaForManageUserDialog.user ? metaForManageUserDialog.user.address.id : 0),
        street: data.street,
        number: data.number,
        box: data.box,
        city: data.city,
        postalcode: data.postalcode,
        county: data.county,
        country: {
          id: (country.current ? country.current.id : 0),
          name: (country.current ? country.current.name : ""),
          dialCode: (country.current ? country.current.dialCode : "")
        }
      },
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
      groups: {
        original: [],
        selected: groups,
        removed: removedGroups
      }
    }
  }

  const userChangedCallback = () => {
    handleDialogState(false);
    setReload((x: any) => x+1);
  }

  const handleManageUser = (data: any): void => {
    if  (metaForManageUserDialog.user) {
      const user: UserType = prepareUser(data);
      if  (user) {
        updateUser(user, userChangedCallback);
      }
    } else {
      const user: UserType = prepareUser(data);

      if  (user) {
        createUser(user, userChangedCallback);
      }
    }
    handleReset();
  }

  const countriesLoadedCallback = (data: CountryType[]) => {
    const _country: CountryType|undefined = data.find((country: CountryType) => country.name === defaultCountry.name);

    if  (_country) {
      country.current = _country;
    }
  }

  const setRelations = (user: UserType|undefined): void => {
    if (user) {
      if (user.roles.original.length > 0) {
        const mappedRoles: Data[] = mapRolesToData(user.roles.original);
        selectedRoles.current = mappedRoles
        originalRoles.current = mappedRoles;
      }

      if (user.policies.original.length > 0) {
        const mappedPolicies: Data[] = mapPoliciesToData(user.policies.original);
        selectedPolicies.current = mappedPolicies;
        originalPolicies.current = mappedPolicies;
      }

      if (user.groups.original.length > 0) {
        const mappedGroups: Data[] = mapGroupsToData(user.groups.original);
        selectedGroups.current = mappedGroups;
        originalGroups.current = mappedGroups;
      }
    } else {
      selectedRoles.current = [];
      selectedPolicies.current = [];
      selectedGroups.current = [];
    }
  }

  const validateFormValues = (data: FormSchemaType) => {
    try {
      const parsedData = FormSchema.parse(data);
      handleManageUser(data);

    } catch (error) {
        if (error instanceof z.ZodError) {
          showAlert("validation failed", "User data is not correct");
        } else {
        console.error("Unexpected error: ", error);
      }
    }
  }

  const handleSubmitForm = () => {
    if (metaForManageUserDialog.form?.getValues) {
      validateFormValues(metaForManageUserDialog.form.getValues())
    } else {
      console.log("GetValues not defined");
    }
  }

  useEffect(() => {
    if (meta.user) {
      setRelations(metaForManageUserDialog.user);
      country.current = meta.user.address.country;
    } else {
      selectedRoles.current = [];
      selectedPolicies.current = [];
      selectedGroups.current = [];
      handleLoadCountries(countriesLoadedCallback);
    }

    meta.control?.test ? meta.control.test("ManageUserDialog") : () => {};

    meta.control ? meta.control.closeDialog = closeDialog : meta.control = {closeDialog: closeDialog};
    meta.control ? meta.control.handleUser = handleManageUser : meta.control = {handleUser: handleManageUser};
    meta.form ? meta.form.submitForm = handleSubmitForm : meta.form = {submitForm: handleSubmitForm};
    meta.sender = "ManageUserdialog";
    meta.items ? meta.items.setSelection = setSelection : meta.items = {setSelection: setSelection}
    meta.items ? meta.items.getSelection = getSelection : meta.items = {getSelection: getSelection}
    meta.items ? meta.items.validateItems = validateItems : meta.items = {validateItems: validateItems}
  
    setMetaForManageUserDialog(meta);
    meta.changeMeta ? meta.changeMeta(meta) : (_meta: Meta) => {}
  }, []);

  const updateCountry = (_country: CountryType) => {
    country.current = _country;
  }

  const setSelection = (type: string, data: Data[]) => {
    switch (type) {
      case issuer_roles:
        selectedRoles.current = data;
        break;
      case issuer_policies:
        selectedPolicies.current = data;
        break;
      case issuer_groups:
        selectedGroups.current = data;
        break
    }
  }

  const getSelection = (type: string): Data[] => {
    log(true, "MUD", "getSelection");
    if (type === issuer_roles) {
      log(true, "MUD", "getSelection(roles)", selectedRoles.current, true);
      return selectedRoles.current
    }

    if (type === issuer_policies) {
      log(true, "MUD", "getSelection(policies)", selectedPolicies.current, true);
      return selectedPolicies.current
    }

    if (type === issuer_groups) {
      log(true, "MUD", "getSelection(group)", selectedGroups.current, true);
      return selectedGroups.current
    }

    return [];
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

  const validateItems = (): boolean => {
    const policyStatements: Data[] = getPolicyStatements(selectedPolicies.current);
    const roleStatements: Data[] = getRoleStatements(selectedRoles.current);

    const validationData: Data[] = [...policyStatements, ...roleStatements];

    let validationResult: ValidationType = validateData(validationData);

    if (validationResult.result === "error") {
      showAlert("Validation Error", validationResult.message!);
    }

    return (validationResult.result === "ok");
  }

  const renderComponent = () => {
    if (alert && alert.open) {
      return (<AlertMessage alert={alert}></AlertMessage>)
    }

    if (metaForManageUserDialog) {
      return (
          <Dialog open={open}>
            <DialogTrigger asChild>
              <EcafeButton id="dialogButton" className="bg-orange-400 hover:bg-orange-600 mr-3" caption="Manage user" clickHandler={handleDialogState} clickValue={true} enabled={_enabled}/>
            </DialogTrigger>
            <DialogContent className="min-w-[75%]" aria-describedby="">
              <DialogHeader className="mb-2">
                <DialogTitle>
                  <PageTitle title="Manage user" className="m-2 -ml-[2px]"/>
                  <Separator className="bg-red-500"/>
                </DialogTitle>
              </DialogHeader>
      
              <Tabs className="w-[100%]" defaultValue="userdetails">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="userdetails">🙍🏻‍♂️ User Details</TabsTrigger>
                <TabsTrigger value="roles" >🔖 Roles</TabsTrigger>
                <TabsTrigger value="policies" >📜 Policies</TabsTrigger>
                <TabsTrigger value="groups" >👨‍👦‍👦 Groups</TabsTrigger>
              </TabsList>
              <TabsContent value="userdetails">
                <div className="m-1 container w-[99%]">
                <TabUserDetails _meta={metaForManageUserDialog} updateCountry={updateCountry} />
                </div>
              </TabsContent>
              <TabsContent value="roles">
                <div className="m-1 container w-[99%]">
                <TabRoles meta={metaForManageUserDialog} />
                </div>
              </TabsContent>
              <TabsContent value="policies">
                <div className="m-1 container w-[99%]">
                <TabPolicies meta={metaForManageUserDialog} />
                </div>
              </TabsContent>
              <TabsContent value="groups">
                <div className="m-1 container w-[99%]">
                <TabGroups meta={metaForManageUserDialog} />
                </div>
              </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
      )
    }

    return null;
  }

return (<>{renderComponent()}</>);
}

export default ManageUserDialog