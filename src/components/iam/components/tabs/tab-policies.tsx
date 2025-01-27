import TabItems from "@/components/iam/components/tab-items";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Data, mapPoliciesToData } from "@/lib/mapping";
import { ColumnMeta, RowData } from "@tanstack/react-table"
import { handleLoadPolicies } from "@/lib/db";
import { PolicyType, UserType } from "@/data/iam-scheme";
import { log } from "@/lib/utils";
import { cancelButton, createButton, issuer_policies, MetaBase, updateButton, validateButton } from "@/data/meta";
import { FieldValues } from "react-hook-form";

const TabPolicies = <T extends FieldValues,>({meta}:{meta: MetaBase<T>; }) => {
  const [metaForTabPolicies, setMetaForTabPolicies] = useState<MetaBase<T>>();

  const policiesLoadedCallback = (_data: PolicyType[]) => {
    let mappedPolicies: Data[] = mapPoliciesToData(_data);

    let createMode: boolean = (meta.subject === undefined);
    if (! createMode) {
      createMode = (meta.subject.id === 0);
    }

    meta.buttons = [validateButton, createMode ? createButton : updateButton, cancelButton]
    meta.items ? meta.items.issuer = issuer_policies : meta.items = {issuer: issuer_policies};
    meta.items ? meta.items.title = "Assign policies to user" : meta.items = {title: "Assign policies to user"};
    meta.items ? meta.items.columnname = "Policies" : meta.items = {columnname: "Policies"};
    meta.items ? meta.items.data = mappedPolicies : meta.items = {data: mappedPolicies};

    setMetaForTabPolicies(meta);
    meta.changeMeta ? meta.changeMeta(meta) : (_meta: MetaBase<T>) => {}
  }

  useEffect(() => {
    handleLoadPolicies(policiesLoadedCallback);
  }, [])

  const renderComponent = () => {
    if (metaForTabPolicies) {
      return (
        <TabItems<T> meta={metaForTabPolicies}/>
      );
    }

    return null;
  }

  return (<>{renderComponent()}</>)
}

export default TabPolicies;