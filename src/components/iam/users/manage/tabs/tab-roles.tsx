'use client'

import TabItems from "@/components/iam/components/tab-items"
import { assignButton, cancelButton, issuer_roles, Meta, validateButton } from "./data/meta"
import { ColumnMeta, RowData } from "@tanstack/react-table"
import { RoleType } from "@/data/iam-scheme"
import { Data, mapRolesToData } from "@/lib/mapping"
import { useEffect, useState } from "react"
import { handleLoadRoles } from "@/lib/db"
import { useToast } from "@/hooks/use-toast"

const TabRoles = ({meta}:{meta: Meta}) => {
  const { toast, dismiss } = useToast();
  let toastId: string;

  const [metaForRoles, setMetaForRoles] = useState<Meta>();

  const renderToast = () => {
      let {id} = toast({title: "Roles", description: "loading ..."})
      toastId = id;
  }

  const rolesLoadedCallback = (_data: RoleType[]) => {
    let mappedRoles = mapRolesToData(_data);

    meta.buttons = [validateButton, assignButton, cancelButton]
    meta.items = {
      issuer: issuer_roles,
      title: "Assign roles to user",
      columnname: "Roles",
      data: mappedRoles,
      setSelection: meta.items?.setSelection,
      validateItems: meta.items?.validateItems
    }
    setMetaForRoles(meta);

    dismiss(toastId);
  }

  const columnMeta: ColumnMeta<Data, string> = {
    title: "Role"
  };

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