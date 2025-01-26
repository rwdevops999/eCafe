'use client'

import EcafeButton from "@/components/ecafe/ecafe-button";
import PageTitle from "@/components/ecafe/page-title";
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
import { AlertTableType, AlertType } from "@/data/types";
import { CountryType, defaultCountry, GroupType, PolicyType, RoleType, UserType } from "@/data/iam-scheme";
import { Data, fullMapSubjectToData, mapGroupsToData, mapPoliciesToData, mapRolesToData } from "@/lib/mapping";
import { validateMappedData } from "@/lib/validate";
import { Button } from "@/components/ui/button";
import { createUser, handleLoadCountries, loadDependencies, updateUser } from "@/lib/db";
import { z } from "zod";
import AlertMessage from "@/components/ecafe/alert-message";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "@/components/datatable/data-table";
import { alertcolumns } from "@/components/ecafe/table/alert-columns";
import AlertTable from "@/components/ecafe/alert-table";

const ManageUserDialog = ({meta, _enabled, handleReset, setReload}:{meta: Meta; _enabled:boolean; handleReset(): void; setReload(x:any):void;}) => {
  log (true, "MUD", "IN", meta.data, true);

  const [metaForManageUserDialog, setMetaForManageUserDialog] = useState<Meta>(meta);

  const originalRoles = useRef<Data[]>([]);
  const selectedRoles = useRef<Data[]>([]);

  const originalPolicies = useRef<Data[]>([]);
  const selectedPolicies = useRef<Data[]>([]);

  const originalGroups = useRef<Data[]>([]);
  const selectedGroups = useRef<Data[]>([]);

  /**
   * state of the dialog
   */
  const [open, setOpen] = useState<boolean>(false);

  const handleDialogState = (state: boolean) => {
    setOpen(state);
  }

  const closeDialog = () => {
    originalRoles.current = [];
    selectedRoles.current = [];
  
    originalPolicies.current = [];
    selectedPolicies.current = [];
  
    originalGroups.current = [];
    selectedGroups.current = [];
  
    handleDialogState(false);
    handleReset();
  }

  const [valid, setValid] = useState<boolean>(false);

  const prepareUser = (data: any): UserType => {
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

    const groups: GroupType[] = selectedGroups.current.map(_group => {
      let group: GroupType = {
        id: _group.id,
      }

      return group;
    });

    const diffGroups: number[] = difference(originalGroups.current, selectedGroups.current);
    const removedGroups: GroupType[] = diffGroups.map(_id => {
      let group: GroupType = {
        id: _id
      }

      return group;
    });

    log(true, "MGD", "prepareUser[roles]", roles, true);
    log(true, "MGD", "prepareUser[removedRoles]", removedRoles, true);
    log(true, "MGD", "prepareUser[policies]", policies, true);
    log(true, "MGD", "prepareUser[removedPolicies]", removedPolicies, true);
    log(true, "MGD", "prepareUser[groups]", groups, true);
    log(true, "MGD", "prepareUser[removedGroups]", removedGroups, true);

    return {
      id: (metaForManageUserDialog.subject ? metaForManageUserDialog.subject.id : 0),
      name: data.name,
      firstname: data.firstname,
      phone: data.phone,
      phonecode: metaForManageUserDialog.data.country.dialCode,
      email: data.email,
      password: data.password,
      address: {
        id: (metaForManageUserDialog.subject ? metaForManageUserDialog.subject.address?.id : 0),
        street: data.street,
        number: data.number,
        box: data.box,
        city: data.city,
        postalcode: data.postalcode,
        county: data.county,
        country: metaForManageUserDialog.data.country
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
    if  (metaForManageUserDialog.subject) {
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
      metaForManageUserDialog.data.country = {
          id: (_country.id ? _country.id : 0),
          name: (_country.name ? _country.name: defaultCountry.name),
          dialCode: (_country.dialCode ? _country.dialCode : defaultCountry.dialCode)
        }
      log (true, "MUD", "Countries Loaded", metaForManageUserDialog.data, true);
      metaForManageUserDialog.changeMeta ? metaForManageUserDialog.changeMeta(metaForManageUserDialog) : null;
    }
  }

  const setRelations = (user: UserType|undefined): void => {
    if (user) {
      if (user.roles && user.roles.original.length > 0) {
        const mappedRoles: Data[] = mapRolesToData(user.roles.original);
        selectedRoles.current = mappedRoles
        originalRoles.current = mappedRoles;
      }

      if (user.policies && user.policies.original.length > 0) {
        const mappedPolicies: Data[] = mapPoliciesToData(user.policies.original);
        selectedPolicies.current = mappedPolicies;
        originalPolicies.current = mappedPolicies;
      }

      if (user.groups && user.groups.original.length > 0) {
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

  const [tab, setTab] = useState("userdetails");

  const switchTabAndSubmit = () => {
    log(true, "MUD", "switch tab");
    setTab("userdetail");
      if (metaForManageUserDialog.handleSubmitForm) {
        log(true, "MUD", "SUBMIT FORM CALLABLE");
        metaForManageUserDialog.handleSubmitForm();
      }
    // metaForManageUserDialog.control && metaForManageUserDialog.control.handleSubmitForm ? metaForManageUserDialog.control.handleSubmitForm() : null
  }

  const validateFormValues = (data: FormSchemaType) => {
    log(true, "MUD", "validateFormValues", data, true);

    try {
      const parsedData = FormSchema.parse(data);
      handleManageUser(data);

    } catch (error) {
        if (error instanceof z.ZodError) {
          showSimpleAlert("validation failed", "User data is not correct");
          switchTabAndSubmit("userdetails");
        } else {
        console.error("Unexpected error: ", error);
      }
    }
  }

  const handleSubmitForm = () => {
    if (metaForManageUserDialog.form?.getValues) {
      validateFormValues(metaForManageUserDialog.form.getValues())
    }
  }

  useEffect(() => {
    if (metaForManageUserDialog.subject) {
      setRelations(metaForManageUserDialog.subject);
    } else {
      selectedRoles.current = [];
      selectedPolicies.current = [];
      selectedGroups.current = [];
      handleLoadCountries(countriesLoadedCallback);
    }

    meta.control ? meta.control.closeDialog = closeDialog : meta.control = {closeDialog: closeDialog};
    meta.control ? meta.control.handleSubject = handleManageUser : meta.control = {handleSubject: handleManageUser};
    meta.form ? meta.form.submitForm = handleSubmitForm : meta.form = {submitForm: handleSubmitForm};
    meta.sender = "ManageGroupdialog";
    meta.items ? meta.items.setSelection = setSelection : meta.items = {setSelection: setSelection}
    meta.items ? meta.items.getSelection = getSelection : meta.items = {getSelection: getSelection}
    meta.items ? meta.items.validateItems = validateItems : meta.items = {validateItems: validateItems}
  
    setMetaForManageUserDialog(meta);
    
    meta.changeMeta ? meta.changeMeta(meta) : (_meta: Meta) => {}
  }, [meta.subject]);

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
    if (type === issuer_roles) {
      return selectedRoles.current
    }

    if (type === issuer_policies) {
      return selectedPolicies.current
    }

    if (type === issuer_groups) {
      return selectedGroups.current
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
    log(true, "MUD", "Validate Subject", subject, true);

    const mappedSubject: Data[] = fullMapSubjectToData(subject);
    const conflicts = validateMappedData(mappedSubject);

    if (conflicts.length > 0) {
      showTableAlert("Validation Error", "Conflicts", conflicts);
    }

    setValid(conflicts.length === 0);
    // setValid(true);
  }

  const dependencyGroupsLoadedCallback = (subject: any, data: any[]) => {
    subject.groups.original = data;

    log(true, "MUD", "VALIDATE SUBJECT");
    validateSubject(subject);
  }

  const dependencyPoliciesLoadedCallback = (subject: any, data: any[]) => {
      subject.policies.original = data;

      if (subject.groups && subject.groups.selected && subject.groups.selected.lenght > 0) {
        log(true, "MUD", "Loading Groups(3)");
        loadDependencies(subject, "http://localhost:3000/api/iam/groups/dependencies", subject.groups.selected, dependencyGroupsLoadedCallback);
      } else {
        validateSubject(subject);
      }
  }
  
  const dependencyRolesLoadedCallback = (subject: any, data: any[]) => {
    log(true, "MUD", "...ROLES LOADED", data, true);

    subject.roles.original = data;

    if (subject.policies && subject.policies.selected && subject.policies.selected.length > 0) {
      log(true, "MUD", "Loading Policies(2)");
      loadDependencies(subject, "http://localhost:3000/api/iam/policies/dependencies", subject.policies.selected, dependencyPoliciesLoadedCallback);
    } else if (subject.groups && subject.groups.selected && subject.groups.selected.length > 0) {
      log(true, "MUD", "Loading Groups(2)");
      loadDependencies(subject, "http://localhost:3000/api/iam/groups/dependencies", subject.groups.selected, dependencyGroupsLoadedCallback);
    } else {
      validateSubject(subject);
    }
  }

  const validateItems = (): boolean => {
    log(true, "MUD", "Validate User", meta.subject, true);

    let user: UserType = meta.subject;
    if (user === undefined) {
      if (metaForManageUserDialog.form && metaForManageUserDialog.form.getValues) {
        log(true, "MUD", "Values defined");
        user = prepareUser(metaForManageUserDialog.form.getValues());

        if (user.roles && user.roles.selected && user.roles.selected.length > 0) {
          log(true, "MUD", "Loading Roles");
          loadDependencies(user, "http://localhost:3000/api/iam/roles/dependencies", user.roles.selected, dependencyRolesLoadedCallback);
        } else if (user.policies && user.policies.selected && user.policies.selected.length > 0) {
          log(true, "MUD", "Loading Policies");
          loadDependencies(user, "http://localhost:3000/api/iam/policies/dependencies", user.policies.selected, dependencyPoliciesLoadedCallback);
        } else if (user.groups && user.groups.selected && user.groups.selected.length > 0) {
          log(true, "MUD", "Loading Groups");
          loadDependencies(user, "http://localhost:3000/api/iam/groups/dependencies", user.groups.selected, dependencyGroupsLoadedCallback);
        }
      }
    }

    return valid;
  }

  const onTabChange = (value: string) => {
    setTab(value);

    if (metaForManageUserDialog && metaForManageUserDialog.form && metaForManageUserDialog.form.getValues) {
      let subject = {
        id: metaForManageUserDialog.subject ? metaForManageUserDialog.subject.id : 0,
        name: metaForManageUserDialog.form.getValues().name,
        firstname: metaForManageUserDialog.form.getValues().firstname,
        code: metaForManageUserDialog.data.country.dialCode,
        phone: metaForManageUserDialog.form.getValues().phone,
        address : {
          street: metaForManageUserDialog.form.getValues().street,
          number:metaForManageUserDialog.form.getValues().number,
          box: metaForManageUserDialog.form.getValues().box,
          city: metaForManageUserDialog.form.getValues().city,
          postalcode: metaForManageUserDialog.form.getValues().postalcode,
          county: metaForManageUserDialog.form.getValues().county,
          country: metaForManageUserDialog.data.country
          },
        email: metaForManageUserDialog.form.getValues().email,
        password: metaForManageUserDialog.form.getValues().password,
      }

      metaForManageUserDialog.subject = subject;
      metaForManageUserDialog.changeMeta ? metaForManageUserDialog.changeMeta(metaForManageUserDialog) : null;
    }
  }

  const renderComponent = () => {
    if (simpleAlert && simpleAlert.open) {
      return (<AlertMessage alert={simpleAlert}></AlertMessage>)
    }
    if (tableAlert && tableAlert.open) {
      return (<AlertTable alert={tableAlert}></AlertTable>)
    }

    if (metaForManageUserDialog) {
      return (
          <Dialog open={open}>
            <DialogTrigger asChild>
              <EcafeButton id="dialogButton" className="bg-orange-400 hover:bg-orange-600 mr-3" caption="Manage user" clickHandler={handleDialogState} clickValue={true} enabled={_enabled}/>
            </DialogTrigger>
            <DialogContent id="DC" className="min-w-[75%]" aria-describedby="">
              <DialogHeader className="mb-2">
                <DialogTitle>
                  <PageTitle title="Manage user" className="m-2 -ml-[2px]"/>
                  <Separator className="bg-red-500"/>
                </DialogTitle>
              </DialogHeader>
      
              <Tabs className="w-[100%]" value={tab} onValueChange={onTabChange}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="userdetails">🙍🏻‍♂️ User Details</TabsTrigger>
                <TabsTrigger value="roles" >🔖 Roles</TabsTrigger>
                <TabsTrigger value="policies" >📜 Policies</TabsTrigger>
                <TabsTrigger value="groups" >👨‍👦‍👦 Groups</TabsTrigger>
              </TabsList>
              <TabsContent value="userdetails">
                <div className="m-1 container w-[99%]">
                <TabUserDetails _meta={metaForManageUserDialog} />
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