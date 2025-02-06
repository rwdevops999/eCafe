import EcafeButton from "@/components/ecafe/ecafe-button";
import { NewButtonConfig } from "@/data/types";
import { MetaBase } from "@/data/meta";
import { ConsoleLogger } from "@/lib/console.logger";
import { useState } from "react";

const ActionButtons = ({buttonConfig, meta, nrOfItemsToValidate}:{buttonConfig:NewButtonConfig; meta: MetaBase; nrOfItemsToValidate: number;}) => {
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

    const [valid, setValid] = useState<boolean>(false);

    const handleValidateSubject = (dummy: boolean) => {
        const isValid: boolean = meta.subject.validateSubject();

        setValid(isValid);
    }

    return (
        <div className="space-y-1">
            {buttonConfig.createButton && <EcafeButton id="createbutton" caption="Create&nbsp;&nbsp;" clickHandler={handleSubmit} enabled={nrOfItemsToValidate <= 1 || valid}/>} 
            {/* clickHandler={handleSetData} enabled={_meta.items?.validationResult || ! validateEnabled}/>} */}
            {buttonConfig.updateButton && <EcafeButton id="updatebutton" caption="Update&nbsp;&nbsp;" clickHandler={handleSubmit} enabled={nrOfItemsToValidate <= 1 || valid}/>} 
            <EcafeButton id="validatebutton" caption="Validate" enabled={nrOfItemsToValidate > 1} clickHandler={handleValidateSubject}/>
            <EcafeButton id="cancelbutton" caption="Cancel&nbsp;&nbsp;" clickHandler={closeDialog}/> 
        </div>
    );
}

export default ActionButtons;