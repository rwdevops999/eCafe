import EcafeButton from "@/components/ecafe/ecafe-button";
import { ConsoleLogger } from "@/lib/console.logger";
import { ButtonConfig } from "@/types/ecafe";
import { useState } from "react";

const ActionButtons = ({buttonConfig, meta, nrOfItemsToValidate}:{buttonConfig:ButtonConfig; meta: MetaBase|undefined; nrOfItemsToValidate: number;}) => {
    const logger = new ConsoleLogger({ level: 'debug' });

    logger.debug("ActionButtons", "IN", nrOfItemsToValidate);
    logger.debug("ActionButtons", "IN", "HIDDEN", (nrOfItemsToValidate <= 1));

    const [valid, setValid] = useState<boolean>(false);

    const closeDialog = (_dummy: boolean) => {
        if (meta) {
            meta.control.clearDependencies();
            meta.control.handleDialogState(false);
        }
    }

    const handleSubmit = (dummy: boolean) => {
        meta ? meta.form.validateForm() : null;
    }

    const handleValidateSubject = (dummy: boolean) => {
        let isValid: boolean = false;
        
        if (meta) {
            meta.subject.validateSubject();
            isValid = meta.subject.getValidationResult();
        }
        
        setValid(isValid);
    }

    return (
        <div className="space-y-1">
            {buttonConfig.createButton && <EcafeButton id="createbutton" caption="Create&nbsp;&nbsp;" clickHandler={handleSubmit} enabled={nrOfItemsToValidate <= 1 || valid}/>} 
            {buttonConfig.updateButton && <EcafeButton id="updatebutton" caption="Update&nbsp;&nbsp;" clickHandler={handleSubmit} enabled={nrOfItemsToValidate <= 1 || valid}/>} 
            <EcafeButton id="validatebutton" caption="Validate" enabled={nrOfItemsToValidate > 1} clickHandler={handleValidateSubject}/>
            <EcafeButton id="cancelbutton" caption="Cancel&nbsp;&nbsp;" clickHandler={closeDialog}/> 
        </div>
    );
}

export default ActionButtons;