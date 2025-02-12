'use client'

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSchemaType } from "../data/form-scheme";
import { Eye, EyeOff } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useDebug } from "@/hooks/use-debug";
import { ConsoleLogger } from "@/lib/console.logger";

const LogonSection = ({formMethods}:{formMethods: UseFormReturn<FormSchemaType>}) => {
  const {debug} = useDebug();
  
  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  const {register, formState: { errors }, setValue, getValues} = formMethods;
  const [viewPassword, setViewPassword] = useState<boolean>(false);

  const passwordRef = useRef<string>("");

  const handleSwitchPassword = () => {
    setViewPassword(!viewPassword);
  }

  const [selectedTrigger, setSelectedTrigger] = useState<string>("password");

  const handlePasswordless = (checked: boolean|string) => {
    if (typeof checked === "string") {
      checked = checked.toLowerCase() === "true";
    }

    logger.debug("LogonSection", "CHECKBOX = " + checked);

    if (checked) {
      logger.debug("LogonSection", "UNREGISTER");

      passwordRef.current = getValues("password");

      setValue("password", "--------");
      // unregister(["password"]);
      setSelectedTrigger("passwordless");
    } else {
      logger.debug("LogonSection", "REGISTER");
      if (passwordRef.current !== "") {
        setValue("password", passwordRef.current);
      }
      
      // register("password");
      setSelectedTrigger("password");
    }

    setValue("passwordless", checked);
  }

  useEffect(() => {
    register("password");

    logger.debug("LogonSection", "LOGON SECTION UE[]", getValues("passwordless"));
    handlePasswordless(getValues("passwordless"));
  }, [])

  const renderComponent = () => {

    logger.debug("LogonSection", "RENDER", getValues("email"), getValues("password"));

    return (
      <Card className="border-stone-500">
        <CardHeader>
          <CardTitle className="underline text-yellow-500">Logon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-[100%] grid grid-cols-12 space-x-2 items-center">
            <div className="col-span-4">
              <div className="grid grid-cols-8 items-center space-x-2">
                <Label className="col-span-2" htmlFor="email">Email:</Label>
                <Input
                  type="text" 
                  id="email"
                  placeholder="email..."
                  className="h-8 col-span-5"
                  {...register("email")}
                />
              </div>
              {/* {errors.email && errors.email.type === "too_small" && <span className="text-red-500" role="alert">Email is required</span>}
              {errors.email && errors.email.type === "invalid_string" && <span className="text-red-500" role="alert">Email be valid</span>} */}
            </div>

            <div className="col-span-4">
              <div className="grid grid-cols-8 items-center space-x-2">
                <Label className="col-span-2" htmlFor="password">Password:</Label>
                <Input 
                  type={viewPassword ? "text" : "password"}
                  id="password"
                  placeholder="password..."
                  disabled={selectedTrigger !== "password"}
                  className="h-8 col-span-4"
                  {...register("password")}
                />
                &nbsp;
                {selectedTrigger === "password" && (
                  viewPassword ? 
                    <EyeOff width={18} height={18} onClick={handleSwitchPassword} className="text-red-500"/> : 
                    <Eye width={18} height={18} onClick={handleSwitchPassword} className="disabled"/>)
                }
              </div>
              {/* {errors.password && errors.password.type === "too_small" && <span className="text-red-500" role="alert">Password must be at least 8 characters</span>}
              {errors.password && errors.password.type === "too_big" && <span className="text-red-500" role="alert">Password may not be longer than 12 characters</span>} */}
            </div>

            <div className="col-span-4">
              <div className="grid grid-cols-8 items-center space-x-2">
              <Checkbox
                  id="passwordless"
                  className="w-4 h-4 col-span-1"
                  checked={getValues("passwordless")}
                  {...register("passwordless")}
                  // onClick={handlePasswordLess}
                  onCheckedChange={(value) => handlePasswordless(value)}
                />
              <Label
                htmlFor="passwordless"
                className="col-span-4 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                On-Time Password
              </Label>
              </div>
            </div>
          </div>

          <div className="w-[100%] grid grid-cols-12 space-x-2 items-center">
            <div className="col-span-4">
              {errors.email && errors.email.type === "too_small" && <span className="text-red-500" role="alert">Email is required</span>}
              {errors.email && errors.email.type === "invalid_string" && <span className="text-red-500" role="alert">Email be valid</span>}
            </div>

            <div className="col-span-4">
              {errors.password && errors.password.type === "too_small" && <span className="text-red-500" role="alert">Password must be at least 8 characters</span>}
              {errors.password && errors.password.type === "too_big" && <span className="text-red-500" role="alert">Password may not be longer than 12 characters</span>}
            </div>

            <div className="col-span-4">
            </div>
          </div>
        </CardContent>
      </Card>
    )
  };

  return (<>{renderComponent()}</>);
}

export default LogonSection;