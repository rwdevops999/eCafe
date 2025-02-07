import { defaultCountry } from "@/data/constants";
import { CountryType } from "@/data/iam-scheme";
import { NewButtonConfig } from "@/data/types";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";

export const storeUserFormValues = (user: NewUserType|undefined, values: UseFormGetValues<any>, countries: CountryType[]): NewUserType => {
    let storedUser: NewUserType = {
        name: "",
        firstname: "",
        email: "",
        password: "",
        phone: ""
    }

    storedUser.name = values("name");
    storedUser.firstname = values("firstname");
    storedUser.email = values("email");
    storedUser.password = values("password");
    storedUser.phone = values("phone");

    if (! storedUser.address) {
        storedUser.address = {
            id: 0,
            street: "",
            number: "",
            box: "",
            city: "",
            postalcode: "",
            county: "",
            country: {
                id: 0,
                name: "",
                code: "",
                dialCode: ""
            },
        }
    }

    storedUser.address.street = values("street");
    storedUser.address.number = values("number");
    storedUser.address.box = values("box");
    storedUser.address.city = values("city");
    storedUser.address.postalcode = values("postalcode");
    storedUser.address.county = values("county");

    if (storedUser.address && !storedUser.address.country) {
        storedUser.address.country = {
            id: 0,
            name: "",
            code: "",
            dialCode: ""
        }
    }

    const dialcode: string = values("dialcode");
    const country = countries.find((country) => country.dialCode === dialcode);

    storedUser.address.country = {
        id: country?.id!,
        name: country?.name!,
        code: country?.code!,
        dialCode: country?.dialCode!
    };

    return storedUser;
}

export const initUserForm = (user: NewUserType|undefined, values: UseFormSetValue<any>) => {
    values("name", user?.name??"");
    values("firstname", user?.firstname??"");
    values("email", user?.email??"");
    values("password", user?.password??"");
    values("phone", user?.phone??"");

    values("street", user?.address?.street??"");
    values("number", user?.address?.number??"");
    values("box", user?.address?.box??"");
    values("city", user?.address?.city??"");
    values("postalcode", user?.address?.postalcode??"");
    values("county", user?.address?.county??"");

    values("dialcode", user?.address?.country.dialCode??defaultCountry.dialCode);
    values("country", user?.address?.country.name??defaultCountry.name);
}

const isSubjectCreated = (subject: NewUserType|NewGroupType): boolean => {
    if (subject === undefined || subject.id === undefined) {
        return false;
    }

    return true;
}

export const defineActionButtons = (subject: NewUserType|NewGroupType): NewButtonConfig => {
    let actionButtons: NewButtonConfig = {
        cancelButton: true
    };

    if (isSubjectCreated(subject)) {
        actionButtons.updateButton = true;
    } else {
        actionButtons.createButton = true;
    }

    return actionButtons;
}

