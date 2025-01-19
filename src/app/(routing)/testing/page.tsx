'use client'

import { intersection, log } from "@/lib/utils";
import { validateData, ValidationType } from "./data/data";
import { Data } from "@/lib/mapping";
import { loadCountries } from "@/lib/country";
import { EmailInput } from "./email-input";
import { PasswordInput } from "./password-input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const Test = () => {

const policies: Data[] =  [
  {
      "id":25,
      "name":"AllowListHistoryPolicy",
      "description":"allow list history",
      "children":
      [
          {
              "id":37,
              "name":"AllowListHistory",
              "description":"allow list history",
              "children":
              [
                  {
                      "id":45,
                      "name":"ListHistory",
                      "description":"ListHistory",
                      "children":
                      [
                      ]
                  }
              ],
              "other":
                  {
                      "serviceId":25,
                      "managed":false,
                      "access": "Allow"
                    }
          }
      ],
      "other":
          {
              "managed":false
          }
  },
  {
      "id":26,
      "name":"DenyListHistoryPolicy",
      "description":"deny list history policy",
      "children":
      [
          {
              "id":38,
              "name":"DenyListHistory",
              "description":"deny list history",
              "children":
              [
                  {
                      "id":46,
                      "name":"ListHistory",
                      "description":"ListHistory",
                      "children":
                      [
                      ]
                  }
              ],
              "other":
                  {
                      "serviceId":25,
                      "managed":false,
                      "access": "Deny"
                    }
          }
      ],
      "other":
          {
              "managed":false
          }
  }
];

const statements: Data[] =  [
  {
    "id":37,
    "name":"AllowListHistory",
    "description":"allow list history",
    "children":
    [
        {
            "id":45,
            "name":"ListHistory",
            "description":"ListHistory",
            "children":
            [
            ]
        }
    ],
    "other":
        {
            "serviceId":25,
            "managed":false,
            "access": "Allow"
        }
  },
  {
    "id":38,
    "name":"DenyListHistory",
    "description":"deny list history",
    "children":
    [
        {
            "id":46,
            "name":"ListHistory",
            "description":"ListHistory",
            "children":
            [
            ]
        }
    ],
    "other":
        {
            "serviceId":25,
            "managed":false,
            "access": "Deny"
        }
  }
];

const test = () => {
  const result: ValidationType = validateData(policies);

  log(true, "TEST", "VALIDATE", result, true);

  const result2: ValidationType = validateData(statements);

  log(true, "TEST", "VALIDATE", result2, true);
}

// test();
// const testReadCsv = () => {
//     let data: any[] = loadCountries();

//     log(true, "TEST", "Loaded Countries", data);
// }

// testReadCsv();

const renderComponent = () => {

    const defaultValue= "Test1";

    const valueChanged = (value: string) => {
        console.log("Value Changed to: " + value);
    };

  return (
    <Select 
    onValueChange={(value) => valueChanged(value)} 
    defaultValue={defaultValue}>
    <SelectTrigger className="col-span-4">
      <SelectValue placeholder="Select a test" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Tests</SelectLabel>
          <SelectItem value="Test1">Test1</SelectItem>
          <SelectItem value="Test2">Test2</SelectItem>
          <SelectItem value="Test3">Test3</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
);
};


  return (<>{renderComponent()}</>)
}

export default Test