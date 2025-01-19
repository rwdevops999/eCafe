import EcafeButton from "@/components/ecafe/ecafe-button";
import { cancelButton, Meta, okButton, updateButton, validateButton } from "../tabs/data/meta";

const ActionButtons = ({_meta}:{_meta:Meta}) => {
    const closeDialog = (value: boolean) => {
        if (_meta.closeDialog) {
            _meta.closeDialog();
        }
    }

    return (
        <div className="space-y-1">
            {_meta.buttons?.includes(validateButton) && <EcafeButton id={"validateButton"} caption="Validate" className="bg-blue-500 hover:bg-blue-600"/>}
            {_meta.buttons?.includes(okButton) && <EcafeButton id={"createButton"} caption="Create&nbsp;&nbsp;" type={"submit"}/>}
            {_meta.buttons?.includes(updateButton) && <EcafeButton id={"updateButton"} caption="Update&nbsp;&nbsp;" type={"submit"}/>}
            {_meta.buttons?.includes(cancelButton) && <EcafeButton id={"cancelButton"} caption="Cancel&nbsp;&nbsp;" enabled className="bg-gray-400 hover:bg-gray-600" clickHandler={closeDialog} clickValue={false}/>}
        </div>
    );
}

export default ActionButtons