'use client'

import TabItems from "@/components/iam/components/tab-items"
import { assignButton, cancelButton, Meta, validateButton } from "./data/meta"
import { ColumnMeta, RowData } from "@tanstack/react-table"
import { RoleType } from "@/data/iam-scheme"
import { Data, mapRolesToData } from "@/lib/mapping"
import { useEffect, useState } from "react"
import { handleLoadRoles } from "@/lib/db"
import { useToast } from "@/hooks/use-toast"

const TabRoles = ({meta}:{meta: Meta}) => {
  const { toast, dismiss } = useToast();
  let toastId: string;

  const [metaRoles, setMetaRoles] = useState<Meta>();

  const renderToast = () => {
      let {id} = toast({title: "Roles", description: "loading ..."})
      toastId = id;
  }

  const rolesLoadedCallback = (_data: RoleType[]) => {
    let mappedRoles = mapRolesToData(_data);

    meta.buttons = [validateButton, assignButton, cancelButton]
    meta.items = {
      title: "Assign roles to user",
      columnname: "Roles",
      data: mappedRoles
    }
    setMetaRoles(meta);

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
    if (metaRoles) {
      return (
        <TabItems meta={metaRoles}/>
      );
    }

    return null;
  }

    return (<>{renderComponent()}</>)
  }

export default TabRoles