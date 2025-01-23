'use client'

import TabItems from "@/components/iam/components/tab-items"
import { cancelButton, createButton, issuer_roles, Meta, updateButton, validateButton } from "./data/meta"
import { ColumnMeta, RowData } from "@tanstack/react-table"
import { RoleType, UserType } from "@/data/iam-scheme"
import { Data, mapRolesToData } from "@/lib/mapping"
import { useEffect, useState } from "react"
import { handleLoadRoles } from "@/lib/db"
import { useToast } from "@/hooks/use-toast"
import { log } from "@/lib/utils"

const TabRoles = ({meta, user}:{meta: Meta; user: UserType|undefined;}) => {
  const { toast, dismiss } = useToast();
  let toastId: string;

  if (meta.submitForm) {
    console.log("TabRoles: SF defined");
  }

  const [metaForRoles, setMetaForRoles] = useState<Meta>();

  const renderToast = () => {
      let {id} = toast({title: "Roles", description: "loading ..."})
      toastId = id;
  }

  const rolesLoadedCallback = (_data: RoleType[]) => {
    let mappedRoles = mapRolesToData(_data);

    meta.buttons = [validateButton, (user ? updateButton : createButton), cancelButton]
    meta.items = {
      issuer: issuer_roles,
      title: "Assign roles to user",
      columnname: "Roles",
      data: mappedRoles,
      setSelection: meta.items?.setSelection,
      getSelection: meta.items?.getSelection,
      validateItems: meta.items?.validateItems,
    }
    setMetaForRoles(meta);

    dismiss(toastId);
  }

  useEffect(() => {
    renderToast();
    handleLoadRoles(rolesLoadedCallback);
  }, [])

  const renderComponent = () => {
    if (metaForRoles) {
      return (
        <TabItems meta={metaForRoles}/>
      );
    }

    return null;
  }

    return (<>{renderComponent()}</>)
  }

export default TabRoles