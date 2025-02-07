import { CombinedType } from "./types";

// subject is user or group
export type MetaBase = {
    currentSubject?: NewUserType|NewGroupType,
    control: {
        handleDialogState: (b: boolean) => void,
        clearDependencies: () => void,
        setSelection: (type: string, data: (CombinedType[])) => void,
        getSelection: (type: string) => CombinedType[]|undefined
        calculateValidationItems: () => number
    },
    subject: {
        name: string,
        dependency: string,
        getAllDependencies: () => any[]
        validateSubject: () => void,
        getValidationResult: () => boolean,
    },
    form: {
        validateForm: () => void
    }
}

export const initMetaBase = {
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
        validateSubject: () => {},
        getValidationResult: () => {return false},
    },
    form: {
        validateForm: () => {}
    }
}
