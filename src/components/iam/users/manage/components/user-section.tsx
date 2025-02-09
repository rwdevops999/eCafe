import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSchemaType } from "../data/form-scheme";

const UserSection = ({formMethods}:{formMethods: UseFormReturn<FormSchemaType>}) => {
  const {register, formState: { errors }} = formMethods;

  return (
    <Card className="border-stone-500">
      <CardHeader>
        <CardTitle className="underline text-yellow-500">Identification</CardTitle>
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
}

export default UserSection;