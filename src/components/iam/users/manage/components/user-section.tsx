'use client'

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSchemaType } from "../data/form-scheme";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useDebug } from "@/hooks/use-debug";
import { ConsoleLogger } from "@/lib/console.logger";

const UserSection = ({formMethods}:{formMethods: UseFormReturn<FormSchemaType>}) => {
  const {debug} = useDebug();
  
  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  const {getValues, setValue, register, formState: { errors }} = formMethods;

  const [reload, setReload] = useState<number>(0);

  const handleChangeBlocked = (checked: boolean|string) => {
    logger.debug("UserSection", "BLOCKED = " + checked);
    if (typeof checked === "string") {
      checked = checked.toLowerCase() === "true";
    }

    logger.debug("UserSection", "SET BLOCKED = " + checked);

    setValue("blocked", checked);
    setReload((x: number) => x+1);
  }

  const renderComponent = () => {
    logger.debug("UserSection", "RENDER", getValues("password"));
    
    return (
      <Card className="border-stone-500">
        <CardHeader>
          <div className="flex space-x-5 items-center">
            <CardTitle className="underline text-yellow-500">Identification</CardTitle>
            <Checkbox
                id="blocked"
                className="w-4 h-4 col-span-1"
                checked={getValues("blocked")}
                onCheckedChange={(value) => handleChangeBlocked(value)}
                {...register("blocked")}
            />
            <Label
              htmlFor="blocked"
              className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", getValues("blocked") ? "text-red-500 animate-pulse" : "")}
            >
              Blocked
            </Label>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="w-[100%] grid grid-cols-12 space-x-2">
            <div className="col-span-4">
              <div className="grid grid-cols-8 items-center space-x-2">
                <Label className="col-span-2" htmlFor="name">Name:</Label>
                <Input 
                  id="name"
                  placeholder="name..."
                  className="h-8 col-span-5"
                  {...register("name")}
                />
              </div>
              {/* {errors.name && errors.name.type === "too_small" && <span className="text-red-500" role="alert">Name must contain at least 1 character</span>}
              {errors.name && errors.name.type === "too_big" && <span className="text-red-500" role="alert">Name may not contain more than 50 characters</span>} */}
            </div>

            <div className="col-span-4">
              <div className="grid grid-cols-8 items-center space-x-2">
                <Label className="col-span-2" htmlFor="firstname">First Name:</Label>
                <Input 
                  id="firstname"
                  placeholder="first name..."
                  className="h-8 col-span-5"
                  {...register("firstname")}
                />
              </div>
              {/* {errors.firstname && errors.firstname.type === "too_small" && <span className="text-red-500" role="alert">First Name must contain at least 1 character</span>}
              {errors.firstname && errors.firstname.type === "too_big" && <span className="text-red-500" role="alert">First Name may not contain more than 50 characters</span>} */}
            </div>
          </div>

          <div className="w-[100%] grid grid-cols-12 space-x-2">
            <div className="col-span-4">
              {errors.name && errors.name.type === "too_small" && <span className="text-red-500" role="alert">Name must contain at least 1 character</span>}
              {errors.name && errors.name.type === "too_big" && <span className="text-red-500" role="alert">Name may not contain more than 50 characters</span>}
            </div>

            <div className="col-span-4">
              {errors.firstname && errors.firstname.type === "too_small" && <span className="text-red-500" role="alert">First Name must contain at least 1 character</span>}
              {errors.firstname && errors.firstname.type === "too_big" && <span className="text-red-500" role="alert">First Name may not contain more than 50 characters</span>}
            </div>
          </div>

          <div className="w-[100%] grid grid-cols-12 space-x-2">
            <div className="col-span-4">
              <div className="grid grid-cols-8 items-center space-x-2">
                <Label className="col-span-2" htmlFor="dialcode">Phone:</Label>
                <Input 
                  disabled
                  id="dialcode"
                  placeholder="code..."
                  className="h-8 col-span-2 w-[90%]"
                  {...register("dialcode")}
                />
                <Input 
                  id="phone"
                  placeholder="phone..."
                  className="h-8 col-span-3"
                  {...register("phone")}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  };

  return (<>{renderComponent()}</>)
}

export default UserSection;