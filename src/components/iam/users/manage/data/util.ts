import { defaultCountry } from "@/data/constants";
import { CountryType, UserType } from "@/types/ecafe";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";

export const storeUserFormValues = (user: UserType|undefined, values: UseFormGetValues<any>, countries: CountryType[]): UserType => {
    let storedUser: UserType = {
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
    storedUser.passwordless = values("passwordless");
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
