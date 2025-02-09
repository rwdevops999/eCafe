import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSchemaType } from "../data/form-scheme";
import { useEffect, useState } from "react";
import { CountryType } from "@/types/ecafe";
import { handleLoadCountries } from "@/lib/db";

const AddressSection = ({formMethods}:{formMethods: UseFormReturn<FormSchemaType>}) => {
  const {register, setValue, getValues} = formMethods;

  const changeCountry = (event: any) => {
    const countryname = event.target.value;
    console.log("changeCountry = " + countryname);
    setValue("country", countryname);
    const country: CountryType = countries.find((country) => country.name === countryname)!;
    setValue("dialcode", `${country.dialCode}`)
  };

  const [countries, setCountries] = useState<CountryType[]>([]);

  const countriesLoadedCallback = (data: CountryType[]) => {
    console.log("ADRESS LOADED COUNTRIES");
    setCountries(data);
  }

  useEffect(() => {
    handleLoadCountries(countriesLoadedCallback);
  }, []);

  const renderComponent =() => {
    console.log("RENDER", JSON.stringify(countries));

    return (
      <Card className="border-stone-500">
        <CardHeader>
          <CardTitle className="underline text-yellow-500">Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="w-[100%] grid grid-cols-12 space-x-2">
            <div className="col-span-4">
              <div className="grid grid-cols-8 items-center space-x-2">
                <Label className="col-span-2" htmlFor="street">Street:</Label>
                <Input 
                  id="street"
                  placeholder="street..."
                  className="h-8 col-span-5"
                  {...register("street")}
                />
              </div>
            </div>

            <div className="col-span-2">
              <div className="grid grid-cols-8 items-center space-x-2">
                <Label className="col-span-2" htmlFor="number">Nr:</Label>
                <Input 
                  id="number"
                  placeholder="nr..."
                  className="h-8 col-span-3"
                  {...register("number")}
                />
              </div>
            </div>

            <div className="col-span-3">
              <div className="grid grid-cols-8 items-center space-x-2">
                <Label className="col-span-2" htmlFor="box">Box:</Label>
                <Input 
                  id="box"
                  placeholder="box..."
                  className="h-8 col-span-3"
                  {...register("box")}
                />
              </div>
            </div>
          </div>

          <div className="w-[100%] grid grid-cols-12 space-x-2">
            <div className="col-span-4">
              <div className="grid grid-cols-8 items-center space-x-2">
                <Label className="col-span-2" htmlFor="city">City:</Label>
                <Input 
                  id="city"
                  placeholder="city..."
                  className="h-8 col-span-5"
                  {...register("city")}
                />
              </div>
            </div>

            <div className="col-span-2">
              <div className="grid grid-cols-8 items-center space-x-2">
                <Label className="col-span-2" htmlFor="postalcode">Postal:</Label>
                <Input 
                  id="postalcode"
                  placeholder="postal..."
                  className="h-8 col-span-4"
                  {...register("postalcode")}
                />
              </div>
            </div>

            <div className="col-span-3">
              <div className="grid grid-cols-8 items-center space-x-2">
                <Label className="col-span-2" htmlFor="county">County:</Label>
                <Input 
                  id="county"
                  placeholder="county..."
                  className="h-8 col-span-6"
                  {...register("county")}
                />
              </div>
            </div>
          </div>

          <div className="w-[100%] grid grid-cols-12 space-x-2">
            <div className="col-span-4">
              <div className="grid grid-cols-8 items-center space-x-2">
                <Label className="col-span-2" htmlFor="country">Country:</Label>
                <select {...register("country")} className="px-2 py-1 text-sm col-span-5 border-[1px] rounded-sm h-8 border-foreground/10 bg-background outline-foreground/10" onChange={changeCountry} value={getValues("country")}>
                  <option value="" disabled>
                    Select a country
                  </option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.name}>{country.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  };

  return (<>{renderComponent()}</>);
}

export default AddressSection;