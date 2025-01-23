'use client'

import EcafeButton from "@/components/ecafe/ecafe-button";
import { cancelButton, createButton, Meta, updateButton, validateButton } from "../tabs/data/meta";
import { useState } from "react";

const ActionButtons = ({_meta, validateEnabled = false}:{_meta:Meta; validateEnabled?: boolean}) => {
    const [valid, setValid] = useState<boolean>(false);

    const closeDialog = (value: boolean) => {
        if (_meta.closeDialog) {
            _meta.closeDialog();
        }
    }

    const handleValidate = (value: boolean) => {
        if (_meta.items && _meta.items.validateItems) {
            setValid(_meta.items.validateItems());
        }
    }

    return (
        <div className="space-y-1">
            {_meta.buttons?.includes(createButton) && <EcafeButton id={"createButton"} caption="Create&nbsp;&nbsp;" type={"submit"} enabled={valid || ! validateEnabled}/>}
            {_meta.buttons?.includes(validateButton) && <EcafeButton id={"validateButton"} clickHandler={handleValidate} caption="Validate" className="bg-blue-500 hover:bg-blue-600" enabled={validateEnabled}/>}
            {_meta.buttons?.includes(updateButton) && <EcafeButton id={"updateButton"} caption="Update&nbsp;&nbsp;" type={"submit"} enabled={valid || ! validateEnabled}/>}
            {_meta.buttons?.includes(cancelButton) && <EcafeButton id={"cancelButton"} caption="Cancel&nbsp;&nbsp;" className="bg-gray-400 hover:bg-gray-600" clickHandler={closeDialog} clickValue={false} enabled/>}
        </div>
    );
}

export default ActionButtons