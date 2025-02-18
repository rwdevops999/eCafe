'use client'

import { cn, isNumber, js } from "@/lib/utils";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useRef, useState } from "react";
import { PopoverContent } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { allItems } from "@/data/constants";
import { ServiceType } from "@/types/ecafe";
import { handleLoadServices } from "@/lib/db";
import { ApiResponseType } from "@/types/db";

/**
 * Loads the services from API and let us select a service through a combo
 * 
 * @param handleSetService: callback method for service change
 * @param service: the default selected service
 */

const ServiceSelect = ({label = "Select service : ", defaultService, forceAll = false, handleChangeService}:{label?: string; defaultService: string|number; forceAll?:boolean, handleChangeService?(service: string):void;}) => {
  const serviceToDisplay = useRef<string>("");

  const [services, setServices] = useState<string[]>([]);
  const [open, setOpen] = useState(false)

  const servicesLoadedCallback = (_data: ApiResponseType): void => {
    if (_data.status === 200) {

      const services: ServiceType[] = _data.payload;
      if (isNumber(defaultService)) {
        const value: string = defaultService as string;

        const serviceId: number = parseInt(value);
        const service: ServiceType|undefined = services.find((service) => service.id === serviceId);

        if (service) {
          serviceToDisplay.current = service.name;

          if (forceAll) {
            setServices(["All", ...services.map((service: ServiceType) => service.name)]);
          } else {
            setServices(services.map((service: ServiceType) => service.name));
          }
        }
      } else {
        let service: string = "";
  
        service = (defaultService === allItems ? 'All' : defaultService) as string;
        serviceToDisplay.current = service;

        if (defaultService === allItems || forceAll) {
          setServices(["All", ...services.map((service: ServiceType) => service.name)]);
        } else {
          setServices(services.map((service: ServiceType) => service.name));
        }
      }
    }
  }

  useEffect(() => {
    handleLoadServices(servicesLoadedCallback); 
  }, []);

  useEffect(() => {
    handleLoadServices(servicesLoadedCallback); 
  }, [defaultService]);

  const renderComponent = () => {
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
                          (handleChangeService ? handleChangeService(currentValue === 'All' ? allItems : currentValue) : null)
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

    return (<>{renderComponent()}</>)
}

export default ServiceSelect;