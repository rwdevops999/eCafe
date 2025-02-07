import { defaultCountry } from "@/data/constants";
import { CountryType } from "@/data/iam-scheme";
import { NewButtonConfig } from "@/data/types";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";

export const storeGroupFormValues = (group: NewGroupType|undefined, values: UseFormGetValues<any>): NewGroupType => {
    let storedGroup: NewGroupType = {
        name: "",
        description: "",
    }

    storedGroup.name = values("name");
    storedGroup.description = values("description");

    return storedGroup;
}

export const initGroupForm = (group: NewGroupType|undefined, values: UseFormSetValue<any>) => {
    values("name", group?.name??"");
    values("description", group?.description??"");
}

const groupCreated = (group: NewGroupType|undefined): boolean => {
    if (group == undefined || group.id === undefined) {
        return false;
    }

    return true;
}

export const defineActionButtons = (group: NewGroupType): NewButtonConfig => {
    let actionButtons: NewButtonConfig = {
        cancelButton: true
    };

    if (groupCreated(group)) {
        actionButtons.updateButton = true;
    } else {
        actionButtons.createButton = true;
    }

    return actionButtons;
}