import * as  fs from 'fs';
import * as path from 'path';

//COUNTRY,A2,A3,NUM,DIALINGCODE
export type Country = {
    name: string;
    dial_code: string;
    code: string;
}

export const loadCountries = (filename: string): Country[] => {
    const csvFilePath = path.resolve(filename);
    const fileContent = fs.readFileSync(csvFilePath);
    var decoder = new TextDecoder("utf-8");
    let str = decoder.decode(fileContent);

    let countries: Country[] = JSON.parse(str);

    return countries;
};
