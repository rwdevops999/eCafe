import { GroupType } from "@/types/ecafe";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";

export const storeGroupFormValues = (group: GroupType|undefined, values: UseFormGetValues<any>): GroupType => {
    let storedGroup: GroupType = {
        name: "",
        description: "",
    }

    storedGroup.name = values("name");
    storedGroup.description = values("description");

    return storedGroup;
}

export const initGroupForm = (group: GroupType|undefined, values: UseFormSetValue<any>) => {
    values("name", group?.name??"");
    values("description", group?.description??"");
}
