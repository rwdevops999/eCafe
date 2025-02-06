import { UseFormReturn } from "react-hook-form";
import { CombinedType } from "./types";

// subject is user or group
export type MetaBase = {
    currentSubject?: NewUserType|NewGroupType,
    // handleManageSubject: () => void,
    // validateSubject: () => void,
    // selectedItems: number,
    control: {
        // name: string,
        // dependency: string,
        handleDialogState: (b: boolean) => void,
        clearDependencies: () => void,
        setSelection: (type: string, data: (CombinedType[])) => void,
        getSelection: (type: string) => CombinedType[]|undefined
        calculateValidationItems: () => number
    },
    subject: {
        name: string,
        dependency: string,
        getAllDependencies: () => CombinedType[]
        validateSubject: () => boolean,
    },
    form: {
        validateForm: () => void
    }
}

export const initMetaBase = {
    // handleManageSubject: () => {},
    // validateSubject: () => {},
    // selectedItems: 0,
    control: {
        handleDialogState: (b: boolean) => {},
        clearDependencies: () => {},
        setSelection: (type: string, data: (CombinedType[])) => {},
        getSelection: (type: string) => {return undefined},
        calculateValidationItems: () => {return 0},
    },
    subject: {
        name: "",
        dependency: "",
        getAllDependencies: () => {return []},
        validateSubject: () => {return false},
    },
    form: {
        validateForm: () => {}
    }
}
  
    