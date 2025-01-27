'use client'

import { RoleType, UserType } from "@/data/iam-scheme"
import { mapRolesToData } from "@/lib/mapping"
import { useEffect, useState } from "react"
import { handleLoadRoles } from "@/lib/db"
import { useToast } from "@/hooks/use-toast"
import TabItems from "@/components/iam/components/tab-items"
import { cancelButton, createButton, issuer_roles, MetaBase, updateButton, validateButton } from "@/data/meta"
import { FieldValues } from "react-hook-form"

const TabRoles = <T extends FieldValues,>({meta}:{meta: MetaBase<T>; }) => {
  const [metaForTabRoles, setMetaForTabRoles] = useState<MetaBase<T>>();

  const rolesLoadedCallback = (_data: RoleType[]) => {
    let mappedRoles = mapRolesToData(_data);

    let createMode: boolean = (meta.subject === undefined);
    if (! createMode) {
      createMode = (meta.subject.id === 0);
    }

    meta.buttons = [validateButton, createMode ? createButton : updateButton, cancelButton]
    meta.items ? meta.items.issuer = issuer_roles : meta.items = {issuer: issuer_roles};
    meta.items ? meta.items.title = "Assign roles to user" : meta.items = {title: "Assign roles to user"};
    meta.items ? meta.items.columnname = "Roles" : meta.items = {columnname: "Roles"};
    meta.items ? meta.items.data = mappedRoles : meta.items = {data: mappedRoles};

    setMetaForTabRoles(meta);
    meta.changeMeta ? meta.changeMeta(meta) : (_meta: MetaBase<T>) => {}
  }

  useEffect(() => {
    handleLoadRoles(rolesLoadedCallback);
  }, [])

  const renderComponent = () => {
    if (metaForTabRoles) {
      return (
        <TabItems<T> meta={metaForTabRoles}/>
      );
    }

    return null;
  }

    return (<>{renderComponent()}</>)
  }

export default TabRoles