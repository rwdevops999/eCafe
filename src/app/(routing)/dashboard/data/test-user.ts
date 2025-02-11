import { UserType } from "@/types/ecafe";

export const testUser: UserType = {
    name: "Welter",
    firstname: "Rudi",
    phone: "471611256",
    email: "rudi.welter@gmail.com",
    password: "********",
    attemps: 0,
    blocked: true,
    createDate: new Date(),
    address: {
        id: 0,
        street: "Suikerpotstraat",
        number: "6",
        box: "3",
        postalcode: "3290",
        city: "Diest",
        county: "Vlaams-Brabant",
        country: {
            name: "Belgium",
            dialCode: "+32",
            code: "BE",
            id: 0
        }
    }
}