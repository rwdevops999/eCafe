'use client'

import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { accessAllow, accessDeny, defaultAccess } from "@/data/constants";

const access: string = defaultAccess;

export interface SwitchProps {
  value: string;
  accessFn: (access: string) => void
}

const AllowDenySwitch = (props: SwitchProps) => {
  let [checked, setChecked] = useState(access === defaultAccess);

  const handleCheckChange = () => {
    const isChecked = checked;
    setChecked(!isChecked);
    props.accessFn(isChecked ? accessDeny : accessAllow);
  };
  
  useEffect(() => {
    setChecked(props.value === defaultAccess ? true: false);
  }, [props]);

  return (
    <div className="flex items-center space-x-2">
      <Label className={!checked ? "text-foreground" : "text-green-500"} htmlFor="execute">{accessAllow}</Label>
      <Switch id="execute" checked={!checked} onCheckedChange={handleCheckChange}/>
      <Label className={checked ? "text-foreground" : "text-orange-600"} htmlFor="execute">{accessDeny}</Label>
    </div>
  );
}

export default AllowDenySwitch