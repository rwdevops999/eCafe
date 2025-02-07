import { ButtonConfig, GroupType, UserType } from "@/types/ecafe";

const isSubjectCreated = (subject: UserType|GroupType): boolean => {
    if (subject === undefined || subject.id === undefined) {
        return false;
    }

    return true;
}

export const defineActionButtons = (subject: UserType|GroupType): ButtonConfig => {
    let actionButtons: ButtonConfig = {
        cancelButton: true
    };

    if (isSubjectCreated(subject)) {
        actionButtons.updateButton = true;
    } else {
        actionButtons.createButton = true;
    }

    return actionButtons;
}
