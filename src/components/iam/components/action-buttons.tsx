import EcafeButton from "@/components/ecafe/ecafe-button";
import { NewButtonConfig } from "@/data/types";
import { MetaBase } from "@/data/meta";

const ActionButtons = ({buttonConfig, meta}:{buttonConfig:NewButtonConfig; meta: MetaBase}) => {
    const closeDialog = (_dummy: boolean) => {
        meta.control.clearDependencies();
        meta.control.handleDialogState(false);
    }

    const handleSubmit = (dummy: boolean) => {
        console.log("TAB ITEM => HANDLE SUBMIT");
        meta.form.validateForm();
    }

    return (
        <div className="space-y-1">
            {buttonConfig.createButton && <EcafeButton id="createbutton" caption="Create&nbsp;&nbsp;" clickHandler={handleSubmit}/>} 
            {/* clickHandler={handleSetData} enabled={_meta.items?.validationResult || ! validateEnabled}/>} */}
            {buttonConfig.updateButton && <EcafeButton id="updatebutton" caption="Update&nbsp;&nbsp;" clickHandler={handleSubmit}/>} 
            {buttonConfig.validateButton && <EcafeButton id="validatebutton" caption="Validate" />} 
            <EcafeButton id="cancelbutton" caption="Cancel&nbsp;&nbsp;" clickHandler={closeDialog}/> 
        </div>
    );
}

export default ActionButtons;