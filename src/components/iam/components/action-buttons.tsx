import EcafeButton from "@/components/ecafe/ecafe-button";
import { NewButtonConfig } from "@/data/types";
import { MetaBase } from "@/data/meta";
import { ConsoleLogger } from "@/lib/console.logger";

const ActionButtons = ({buttonConfig, meta, nrOfItemsToValidate, valid}:{buttonConfig:NewButtonConfig; meta: MetaBase; nrOfItemsToValidate: number; valid: boolean}) => {
    const logger = new ConsoleLogger({ level: 'debug' });

    logger.debug("ActionButtons", "IN", nrOfItemsToValidate);
    logger.debug("ActionButtons", "IN", "HIDDEN", (nrOfItemsToValidate <= 1));

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
            <EcafeButton id="validatebutton" caption="Validate" enabled={nrOfItemsToValidate > 1}/>
            <EcafeButton id="cancelbutton" caption="Cancel&nbsp;&nbsp;" clickHandler={closeDialog}/> 
        </div>
    );
}

export default ActionButtons;