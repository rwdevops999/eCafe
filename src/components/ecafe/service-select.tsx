'use client'

import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useRef, useState } from "react";
import { PopoverContent } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { all } from "@/data/constants";
import { ServiceType } from "@/data/iam-scheme";
import { handleLoadServices } from "@/lib/db";

/**
 * Loads the services from API and let us select a service through a combo
 * 
 * @param handleSetService: callback method for service change
 * @param service: the default selected service
 */

const ServiceSelect = ({label = "Select service : ", defaultService, forceAll = false, handleChangeService}:{label?: string; defaultService: string; forceAll?:boolean, handleChangeService?(service: string):void;}) => {
  const serviceToDisplay = useRef<string>(defaultService === all ? 'All' : defaultService);

  const [services, setServices] = useState<string[]>([]);
  const [open, setOpen] = useState(false)

  const servicesLoadedCallback = (data: ServiceType[]) => {
    if (defaultService === all || forceAll) {
      setServices(["All", ...data.map(service => service.name)]);
    } else {
      setServices(data.map(service => service.name));
    }
  }

  useEffect(() => {
    handleLoadServices(servicesLoadedCallback); 
  }, []);

  useEffect(() => {
    serviceToDisplay.current = (defaultService === all ? 'All' : defaultService);

    handleLoadServices(servicesLoadedCallback); 
  }, [defaultService]);

  return (
    <div className="flex -ml-3 items-center z-10">
      <Label className="mr-1">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
          <Button
              variant="outline"
              size="sm"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {services.find((s) => s === serviceToDisplay.current)}
              <ChevronsUpDown className="opacity-50" />
          </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0 z-10">
            <Command>
              <CommandInput placeholder="Search service..." />
              <CommandList>
                <CommandEmpty>No service found.</CommandEmpty>
                <CommandGroup>
                  {services.map((service) => (
                    <CommandItem
                      key={service}
                      value={service}
                      onSelect={(currentValue) => {
                        serviceToDisplay.current = currentValue;
                        setOpen(false);
                        (handleChangeService ? handleChangeService(currentValue === 'All' ? all : currentValue) : null)
                      }}
                    >
                      {service}
                      <Check
                        key={service}
                        className={cn("ml-auto", serviceToDisplay.current === service ? "opacity-100" : "opacity-0")}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
  )
}

export default ServiceSelect;