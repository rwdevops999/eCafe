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
import { issuer_groups, issuer_policies, issuer_roles, Meta } from "./tabs/data/meta";
import { log } from "@/lib/utils";
import { DialogDataType, GroupDataType, PolicyDataType, RoleDataType, UserDataType } from "./tabs/data/data";
import { AlertType, CallbackFunctionDefault, CallbackFunctionSubjectLoaded } from "@/data/types";
import { CountryType, defaultCountry, PolicyType, UserType } from "@/data/iam-scheme";
import { Row } from "@tanstack/react-table";
import { Data } from "@/lib/mapping";
import { getPolicyStatements, getRoleStatements, validateData2, ValidationType } from "@/lib/validate";
import { Button } from "@/components/ui/button";
import AlertMessage from "@/app/(routing)/testing/alert-message";

const ManageUserDialog = ({meta, _enabled, user, handleReset, setReload}:{meta: Meta; _enabled:boolean; user: UserType|undefined; handleReset(): void; setReload(x:any):void;}) => {
  const [selectedUser, setSelectedUser] = useState<UserType>();

  const country = useRef<CountryType|undefined>(undefined);

  /**
   * state of the dialog
   */
  const [open, setOpen] = useState<boolean>(false);

  const handleDialogState = (state: boolean) => {
    setOpen(state);
  }

  const closeDialog = () => {
    handleReset();
    handleDialogState(false);
  }

  const prepareUser = (data: any): UserType => {
    return {
      id: (selectedUser ? selectedUser.id : 0),
      name: data.name,
      firstname: data.firstname,
      phone: data.phone,
      phonecode: `(${country.current?.dialCode})`,
      email: data.email,
      password: data.password,
      address: {
        id: (selectedUser ? selectedUser.address.id : 0),
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
      }
    }
  }

  const createUser = async (_data: UserType, callback: CallbackFunctionDefault) => {
    await fetch('http://localhost:3000/api/iam/users',
        {
          method: 'POST',
          body: JSON.stringify(_data),
          headers: {
            'content-type': 'application/json'
          }
      }).then(response => callback());
  }

  const updateUser = async (_data: UserType, callback: CallbackFunctionDefault) => {
    await fetch('http://localhost:3000/api/iam/users',
        {
          method: 'PUT',
          body: JSON.stringify(_data),
          headers: {
            'content-type': 'application/json'
          }
      }).then(response => callback());
  }

  const userChangedCallback = () => {
    handleDialogState(false);
    setReload((x: any) => x+1);
  }

  const handleManageUser = (data: any): void => {
    if  (selectedUser) {
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

  const loadCountries = async (callback: CallbackFunctionSubjectLoaded) => {
      await fetch("http://localhost:3000/api/db?table=country")
        .then((response) => response.json())
        .then((response) => callback(response));
    }
  
    const handleLoadCountries = async (callback: CallbackFunctionSubjectLoaded) => {
      await loadCountries(callback);
    }
  
  
  useEffect(() => {
    setSelectedUser(user);
    if (user) {
      country.current = user.address.country;
    } else {
      handleLoadCountries(countriesLoadedCallback);
    }
  }, [user]);

  meta.closeDialog = closeDialog;
  meta.form = {register: (name: any, options?: any): any => {}};
  meta.userData = {updateData: (data: any): void => {}},
  meta.manageSubject = handleManageUser;
 
  const updateCountry = (_country: CountryType) => {
    country.current = _country;
  }

  const selectedRoles = useRef<Row<Data>[]>([]);
  const selectedPolicies = useRef<Row<Data>[]>([]);
  const selectedGroups = useRef<Row<Data>[]>([]);

  const setSelection = (type: string, data: Row<Data>[]) => {
    log(true, "ManageUserDialog", `SetSelection: ${type}`, data, true);

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
      child: <Button className="bg-orange-500" size="sm" onClick={handleRemoveAlert}>close</Button>
    };
  
    setAlert(alert);
  }

  const validateItems = (): boolean => {
    console.log("ValidateItems");

    const policyStatements: Data[] = getPolicyStatements(selectedPolicies.current);
    const roleStatements: Data[] = getRoleStatements(selectedRoles.current);

    const validationData: Data[] = [...policyStatements, ...roleStatements];

    log(true, "ManageUserDialog", "validateItems", validationData, true);
    
    let validationResult: ValidationType = validateData2(validationData);

    if (validationResult.result === "error") {
      showAlert("Validation Error", validationResult.message!);
    }

    return (validationResult.result === "ok");
  }

  meta.items = {
    setSelection: setSelection,
    validateItems: validateItems
  }

  const renderComponent = () => {
    if (alert && alert.open) {
      return (<AlertMessage alert={alert}></AlertMessage>)
    }

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
  
          <Tabs defaultValue="userdetails" className="w-[100%]">
           <TabsList className="grid grid-cols-4">
             <TabsTrigger value="userdetails">🙍🏻‍♂️ User Details</TabsTrigger>
             <TabsTrigger value="roles">🔖 Roles</TabsTrigger>
             <TabsTrigger value="policies">📜 Policies</TabsTrigger>
             <TabsTrigger value="groups">👨‍👦‍👦 Groups</TabsTrigger>
           </TabsList>
           <TabsContent value="userdetails">
            <div className="m-1 container w-[99%]">
             <TabUserDetails _meta={meta} user={selectedUser} updateCountry={updateCountry}/>
             </div>
           </TabsContent>
           <TabsContent value="roles">
            <div className="m-1 container w-[99%]">
             <TabRoles meta={meta}/>
             </div>
           </TabsContent>
           <TabsContent value="policies">
            <div className="m-1 container w-[99%]">
             <TabPolicies meta={meta} />
             </div>
           </TabsContent>
           <TabsContent value="groups">
            <div className="m-1 container w-[99%]">
             <TabGroups meta={meta}/>
             </div>
           </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    )
  }

return (<>{renderComponent()}</>);
}

export default ManageUserDialog