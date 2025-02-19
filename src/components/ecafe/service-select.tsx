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

const ServiceSelect = (
  {
    label = "Select service : ", 
    defaultService = undefined, 
    forceAll = false, 
    handleChangeService, 
  }:{
    label?: string; 
    defaultService?: string|number|undefined; 
    forceAll?:boolean, 
    handleChangeService?(service: ServiceType|undefined):void; 
  }) => {
  const serviceToDisplay = useRef<string>("");

  console.log ("SS IN", defaultService);

  const [services, setServices] = useState<ServiceType[]>([]);
  const [serviceNames, setServiceNames] = useState<string[]>([]);
  const [open, setOpen] = useState(false)

  const [selectedServiceName, setSelectedServiceName] = useState<string>('All');

  const servicesLoadedCallback = (_data: ApiResponseType, _service: any): void => {
    let services: ServiceType[] = [];

    if (_data.status === 200) {
      console.log("SS: Services Loaded ...");
      services = _data.payload;
      setServices(services);
    }

    console.log("SS", "servicesLoadedCallback", defaultService);
    console.log("SS", "servicesLoadedCallback", "setService", defaultService);

    setService(defaultService, services);
  }

  const changeService = (service: ServiceType|undefined): void => {
    handleChangeService ? handleChangeService(service) : () => {}
  }

  const setService = (_service: number|string|undefined, _services?: ServiceType[]): void => {
    console.log("Change Service Setting", _service??"undefined");

    if (_services === undefined) {
      _services = services;
    }
    
    let serviceName: string = 'All';

    if (_service) {
      if (isNumber(_service)) {
        // defaultService is a service Id
        const id: number = parseInt(defaultService as string);
        console.log("SS", "defaultService is an ID : ", id);
        const service: ServiceType|undefined = _services.find((service) => service.id === id);
        console.log("SS", "defaultService is an ID : services are ", js(services));
        if (service) {
          console.log("SS", "defaultService is an ID : ", "service found");
          serviceName = service.name;
          changeService(service);
        }
      } else {
        // defaultService is a service Name
        const name: string = defaultService as string;
        console.log("SS", "defaultService is a NAME : ", name);
        const service: ServiceType|undefined = _services.find((service) => service.name === name);
        if (service) {
          serviceName = service.name;
          changeService(service);
        }
      }
    } else {
      changeService(undefined);
    }

    console.log("SS", "set ServiceNames", js(services));

    if (! defaultService || forceAll) {
      setServiceNames(["All", ..._services.map((service: ServiceType) => service.name)]);
    } else {
      setServiceNames(_services.map((service: ServiceType) => service.name));
    }

    console.log("SS", "Change display service to : ", serviceName);
    setSelectedServiceName(serviceName);
  }

  useEffect(() => {
    console.log("SS", "MOUNT UseEffect[]");
    handleLoadServices(servicesLoadedCallback); 
    
    return (() => {
      console.log("SS UNMOUNTED");
    });
  }, []);

  useEffect(() => {
    console.log("SS", "UseEffect[defaultService]", defaultService);
    setService(defaultService);
  }, [defaultService]);

  const renderComponent = () => {
    console.log("SS", "RENDER", js(services));

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
                  {serviceNames.find((s) => s === selectedServiceName)}
                  <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 z-10">
              <Command>
                <CommandInput placeholder="Search service..." />
                <CommandList>
                  <CommandEmpty>No service found.</CommandEmpty>
                  <CommandGroup>
                    {serviceNames.map((_serviceName) => (
                      <CommandItem
                        key={_serviceName}
                        value={_serviceName}
                        onSelect={(currentValue) => {
                          setSelectedServiceName(currentValue);
                          setOpen(false);
                          changeService(services.find((service) => service.name === currentValue)); 
                        }}
                      >
                        {_serviceName}
                        <Check
                          key={_serviceName}
                          className={cn("ml-auto", selectedServiceName === _serviceName ? "opacity-100" : "opacity-0")}
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