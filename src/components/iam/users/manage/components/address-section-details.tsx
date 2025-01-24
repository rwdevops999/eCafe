'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Meta } from "../tabs/data/meta";
import { CountryType, defaultCountry, UserType } from "@/data/iam-scheme";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { log } from "@/lib/utils";
import { CallbackFunctionSubjectLoaded } from "@/data/types";
import { handleLoadCountries } from "@/lib/db";

const addressStreet = "street";
const addressNumber = "number";
const addressBox = "box";
const addressCity = "city";
const addressPostal = "postal";
const addressCounty = "county";
const addressCountry = "country";

const AddressSectionDetails = ({_meta}:{_meta: Meta;}) => {
  const [countries, setCountries] = useState<CountryType[]>([]);

  const [country, setCountry] = useState<string>();

  const countriesLoadedCallback = (data: CountryType[]) => {
    setCountries(data.sort((a, b) => a.name!.localeCompare(b.name!)));
    const country: CountryType | undefined = data.find((country) => country.name === defaultCountry.name);
    if  (country) {
      if (_meta.user === undefined) {
        setCountry(country.name);
        _meta.data?.updateData(country);
      }
    }
  }

  useEffect(() => {
    handleLoadCountries(countriesLoadedCallback); 
  }, []);

  useEffect(() => {
    if  (_meta.user) {
      setCountry(_meta.user.address.country.name);
    }
  });

  const handleCountryChange = (_country: string) => {
    const country: CountryType | undefined = countries.find((country) => country.name === _country);
    if (country) {
      setCountry(country.name);
      if (_meta.user !== undefined) {
        _meta.data?.updateData(country);
      }
    }
  };

  const renderComponent = () => {
      return (
        <Card className="border-stone-500">
          <CardHeader>
            <CardTitle className="underline text-yellow-500">Address</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="grid grid-cols-12 mb-1">
            <div className="col-span-6">
              <div className="grid grid-cols-6 items-center">
                <Label className="col-span-1" htmlFor={addressStreet}>Street:</Label>
                <Input
                  id={addressStreet}
                  placeholder={`${addressStreet}...`}
                  className="h-8 col-span-4"
                  {..._meta.form!.register!(addressStreet)}
                  />
              </div>
            </div>
    
            <div className="col-span-3">
              <div className="grid grid-cols-3 items-center">
                <Label className="col-span-1" htmlFor={addressNumber}>Nr:</Label>
                <Input
                  id={addressNumber}
                  placeholder={`Nr...`}
                  className="col-span-1 h-8"
                  {..._meta.form!.register!(addressNumber)}
                />
              </div>
            </div>
    
            <div className="col-span-3">
            <div className="grid grid-cols-3 items-center">
                <Label className="col-span-1" htmlFor={addressBox}>Box:</Label>
                <Input
                  id={addressBox}
                  placeholder={`${addressBox}...`}
                  className="col-span-1 h-8"
                  {..._meta.form!.register!(addressBox)}
                />
              </div>
            </div>
          </div>
    
          <div className="grid grid-cols-12 mb-1">
            <div className="col-span-6">
              <div className="grid grid-cols-6 items-center">
                <Label className="col-span-1" htmlFor={addressCity}>City:</Label>
                <Input
                  id={addressCity}
                  placeholder={`${addressCity}...`}
                  className="h-8 col-span-4"
                  {..._meta.form!.register!(addressCity)}
                />
              </div>
            </div>
            <div className="col-span-3">
            <div className="grid grid-cols-3 items-center">
                <Label className="col-span-1" htmlFor={addressPostal}>Postal:</Label>
                <Input
                  id={addressPostal}
                  placeholder={`${addressPostal}...`}
                  className="h-8 col-span-1"
                  {..._meta.form!.register!("postalcode")}
                />
              </div>
            </div>
          </div>
    
          <div className="grid grid-cols-12 items-center">
            <div className="col-span-6">
              <div className="grid grid-cols-6 items-center">
                <Label className="col-span-1" htmlFor="country">Country:</Label>
                <Select 
                  onValueChange={(value) => handleCountryChange(value)}
                  value={country}
                  >
                  <SelectTrigger className="col-span-4">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Countries</SelectLabel>
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={country.name!}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="col-span-6">
              <div className="grid grid-cols-6 items-center">
                <Label className="col-span-1" htmlFor={addressCounty}>County:</Label>
                <Input
                  id={addressCounty}
                  placeholder={`${addressCounty}...`}
                  className="h-8 col-span-4"
                  {..._meta.form!.register!(addressCounty)}
                />
              </div>
            </div>
          </div>
          </CardContent>
        </Card>
      )
    // }

    // return null;
  }

  return (<>{renderComponent()}</>);
}

export default AddressSectionDetails;