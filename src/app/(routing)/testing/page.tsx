'use client'

import { intersection, log } from "@/lib/utils";
import { Data } from "@/lib/mapping";
import { loadCountries } from "@/lib/country";
import { EmailInput } from "./email-input";
import { PasswordInput } from "./password-input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const Test = () => {

  type MyObject = Record<string, boolean>;

  const test = () => {
    let originalIds: number[] = [1,2];
    let selectedIds: number[] = [3,4];

    const diff: number[] = originalIds.filter(id => selectedIds.indexOf(id) < 0); 
    log(true, "UTILS", "difference[diff]", diff, true);
  }

   test();
// const testReadCsv = () => {
//     let data: any[] = loadCountries();

//     log(true, "TEST", "Loaded Countries", data);
// }

// testReadCsv();

const renderComponent = () => {

  return (
    <></>
  );
};


  return (<>{renderComponent()}</>)
}

export default Test