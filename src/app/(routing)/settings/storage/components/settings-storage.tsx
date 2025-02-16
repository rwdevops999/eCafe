'use client'

import EcafeButton from '@/components/ecafe/ecafe-button';
import PageTitle from '@/components/ecafe/page-title';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { workingItems } from '@/data/constants';
import { useDebug } from '@/hooks/use-debug';
import { ConsoleLogger } from '@/lib/console.logger';
import { createHistory, handleClearDB, handleLoadCountries, handleLoadServices, handleLoadServicesDB, initDB } from '@/lib/db';
import { Database } from 'lucide-react';
import { useEffect, useState } from 'react'
import { toast } from 'sonner';
import HoverInfo from './hover-info';
import { createHistoryType, wait } from '@/lib/utils';
import { ApiResponseType } from '@/types/db';
import { Separator } from '@/components/ui/separator';
import { CountryType, ServiceType } from '@/types/ecafe';

const SettingsStorage = () => {
    const {debug} = useDebug();
    const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none') });

    const [includeCountries, setIncludeCountries] = useState<boolean>(true);

    const [numServices, setNumServices] = useState<number>(0);
    const [numCountries, setNumCountries] = useState<number>(0);

    const databaseCleared = (_response: ApiResponseType): void => {
        if (_response.status === 200) {
            logger.debug("Settings", _response.info);
            toast.success("Database cleared.", {duration: 1000})
            createHistory(createHistoryType("info", "Database cleared", "Database cleared", "Settings[Storage]"), () => {})

            setNumServices(0);
            setNumCountries(0);
        }
    }

    const handleClearFullDatabase = (_dummy: boolean): void => {
        logger.debug("Storage", "handleClearDatabase");

        console.log("Clear DB");
        handleClearDB(true, databaseCleared);
    }

    const dataCleared = (_response: ApiResponseType): void => {
        if (_response.status === 200) {
            logger.debug("Settings", _response.info);
            toast.success("Working data removed.", {duration: 1000})
            createHistory(createHistoryType("info", "Data tables clear", "Database work tables are cleared", "Settings[Storage]"), () => {})
        }
    }

    const handleClearWorkingData = (_dummy: boolean): void => {
        logger.debug("Storage", "handleClearWorkingData");

        initDB(workingItems, dataCleared);
    }

    const countriesLoadedCallback = (_data: ApiResponseType) => {
        if (_data.status === 200) {
            const countries: CountryType[] = _data.payload;

            setNumCountries(countries.length);
        }
    }

    const countriesLoaded = async (_response: ApiResponseType): Promise<void> => {
        if (_response.status === 200) {
            toast.info("Countries loaded.", {duration: 1000})
            createHistory(createHistoryType("info", "Country tables loaded", "Country table resetted", "Settings[Storage]"), () => {})
            handleLoadCountries(countriesLoadedCallback);
        }
    }

    const servicesLoadedCallback = async (_data: ApiResponseType): Promise<void> => {
        if (_data.status === 200) {
            const services: ServiceType[] = _data.payload;

            setNumServices(services.length);
            handleLoadCountries(countriesLoadedCallback);
        }
    }

    const servicesLoaded = async (_response: ApiResponseType): Promise<void> => {
        if (_response.status === 200) {
            logger.debug("Settings", _response.info);
            toast.info(`Services loaded.`, {duration: 1000});
            createHistory(createHistoryType("info", "Service tables loaded", "Loaded all startup tables", "Settings[Storage]"), () => {})
            await wait(500);
            handleLoadServices(servicesLoadedCallback)
        }
    }

    const handleProvisionServices = (_dummy: boolean): void => {
        logger.debug("Storage", "handleProvisionServices");

        handleLoadServicesDB(includeCountries, servicesLoaded);
    }

    const handleProvisionCountries = (_dummy: boolean): void => {
        logger.debug("Storage", "handleProvisionCountries");

        initDB('country', countriesLoaded);
    }

    useEffect(() => {
        handleLoadServices(servicesLoadedCallback);
    }, []);

    const renderComponent = () => {
        return (
            <Card className="w-full h-[30%] border-foreground/30">
                <CardHeader>
                    <div className="flex space-x-2 items-center">
                        <Database />
                        <CardTitle>Database</CardTitle>
                    </div>
                    <CardDescription>Actions against the database.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='space-y-2'>
                        <div>
                            <PageTitle title='Clearing' className='mb-2'/>
                            <div className="grid grid-cols-8 items-center space-x-2">
                                <div className="col-span-1">
                                    <EcafeButton caption='Clear Full Database' clickHandler={handleClearFullDatabase}/>
                                </div>
                                <div className="col-span-1">
                                    <HoverInfo title="Clear" message='Clear the full database.' nextline='Included startup data can also be cleared.' />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="grid grid-cols-8 items-center space-x-2">
                                <div className="col-span-1">
                                    <EcafeButton caption='Clear Working Data' clickHandler={handleClearWorkingData}/>
                                </div>
                                <div className="col-span-1">
                                    <HoverInfo title="Data" message='Clear working data.' nextline='(e.g. Roles/Users/...)' />
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-foreground/30"/>

                        <PageTitle title='Provisioning' className='mb-2'/>

                        <div className="grid grid-cols-8 items-center space-x-2">
                            <div className="col-span-1">
                                <EcafeButton caption={`Load Services (${numServices})`} clickHandler={handleProvisionServices}/>
                            </div>
                            <div className="col-span-1">
                                <HoverInfo title="Services" message="Load the services (and related) into DB." />
                            </div>
                            <div className="col-span-4 flex space-x-2 items-center">
                                <Checkbox
                                    id="startup"
                                    checked={includeCountries}
                                    onCheckedChange={(value) => setIncludeCountries(typeof value === 'boolean' ? value : false)}
                            />
                                <Label
                                    htmlFor="startup"
                                >
                                    Also provision countries
                                </Label>
                               </div>
                        </div>

                        <div className="grid grid-cols-8 items-center space-x-2">
                            <div className="col-span-1">
                                <EcafeButton caption={`Load Countries (${numCountries})`} clickHandler={handleProvisionCountries}/>
                            </div>
                            <div className="col-span-1">
                                <HoverInfo title="Countries" message="Load the countries into DB." />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (<>{renderComponent()}</>);
}

export default SettingsStorage