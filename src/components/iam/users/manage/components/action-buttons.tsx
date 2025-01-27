'use client'

import EcafeButton from "@/components/ecafe/ecafe-button";
import { useState } from "react";
import { FormSchemaType, Meta } from "../tabs/data/meta";
import { cancelButton, createButton, MetaBase, updateButton, validateButton } from "@/data/meta";
import { FieldValues } from "react-hook-form";
import { log } from "@/lib/utils";
import { doLoggie } from "../../debug";

const ActionButtons = <T extends FieldValues,>({_meta, validateEnabled = false}:{_meta:MetaBase<T>; validateEnabled?: boolean}) => {
    const closeDialog = (_dummy: boolean) => {
        if (_meta.control?.closeDialog) {
            _meta.control?.closeDialog();
        }
    }

    const handleValidate = (_dummy: boolean) => {
        log(true, "ActionButtons", "handleValidate");
        if (_meta.items && _meta.items.validateItems) {
            doLoggie<T>("ActionButtons", _meta);
            _meta.items.validateItems();
        }
    }

    const handleSetData = (_dummy: boolean) => {
        if (_meta.form?.submitForm) {
            _meta.form?.submitForm();
        }
    }

    return (
        <div className="space-y-1">
            {_meta.buttons?.includes(createButton) && <EcafeButton id={"createButton"} caption="Create&nbsp;&nbsp;" clickHandler={handleSetData} enabled={_meta.items?.validationResult || ! validateEnabled}/>}
            {_meta.buttons?.includes(validateButton) && <EcafeButton id={"validateButton"} clickHandler={handleValidate} caption="Validate" className="bg-blue-500 hover:bg-blue-600" enabled={validateEnabled}/>}
            {_meta.buttons?.includes(updateButton) && <EcafeButton id={"updateButton"} caption="Update&nbsp;&nbsp;" clickHandler={handleSetData} enabled={_meta.items?.validationResult || ! validateEnabled}/>}
            {_meta.buttons?.includes(cancelButton) && <EcafeButton id={"cancelButton"} caption="Cancel&nbsp;&nbsp;" className="bg-gray-400 hover:bg-gray-600" clickHandler={closeDialog} clickValue={false} enabled/>}
        </div>
    );
}

export default ActionButtons