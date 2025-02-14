'use client'

import EcafeButton from '@/components/ecafe/ecafe-button';
import PageTitle from '@/components/ecafe/page-title';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { allItems, workingItems } from '@/data/constants';
import { useDebug } from '@/hooks/use-debug';
import { ConsoleLogger } from '@/lib/console.logger';
import { handleClearDB, initDB } from '@/lib/db';
import { Database, Info } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'sonner';
import HoverInfo from './hover-info';

const SettingsStorage = () => {
    const {debug} = useDebug();
    const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none') });

    const [startupData, setStartupData] = useState<boolean>(false);

    const databaseCleared = () => {
        toast.success("Database cleared.")
    }

    const handleClearDatabase = (_dummy: boolean): void => {
        logger.debug("Storage", "handleClearDatabase");

        handleClearDB(startupData, databaseCleared);
    }

    const databaseInitialised = () => {
        toast.success("Database initialised.")
    }

    const handleSetupDatabase = (_dummy: boolean): void => {
        logger.debug("Storage", "handleSetupDatabase");

        initDB(allItems, databaseInitialised);
    }

    const dataCleared = () => {
        toast.success("Working data removed.")
    }

    const handleClearData = (_dummy: boolean): void => {
        logger.debug("Storage", "handleSetupDatabase");

        initDB(workingItems, dataCleared);
    }

    const countriesLoaded = () => {
        toast.info("Countries loaded.")
    }

    const handleLoadCountries = (_dummy: boolean): void => {
        logger.debug("Storage", "handleLoadCountries");

        initDB('country', countriesLoaded);
    }

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
                            <div className="grid grid-cols-8 items-center space-x-2">
                                <div className="col-span-1">
                                    <EcafeButton caption='Clear Database' clickHandler={handleClearDatabase}/>
                                </div>
                                <div className="col-span-1">
                                    <HoverInfo title="Clear" message='Clear the database.' nextline='Startup data can also be cleared.' />
                                </div>
                                <div className="col-span-4 flex space-x-2 items-center">
                                <Checkbox
                                    id="startup"
                                    checked={startupData}
                                    onCheckedChange={(value) => setStartupData(typeof value === 'boolean' ? value : false)}
                            />
                                <Label
                                    htmlFor="startup"
                                >
                                    Also startup data
                                </Label>
                               </div>
                            </div>
                        </div>

                        <div>
                            <div className="grid grid-cols-8 items-center space-x-2">
                                <div className="col-span-1">
                                    <EcafeButton caption='Clear Data' clickHandler={handleClearData}/>
                                </div>
                                <div className="col-span-1">
                                    <HoverInfo title="Data" message='Clear working data.' nextline='(e.g. Roles/Users/...)' />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-8 items-center space-x-2">
                            <div className="col-span-1">
                                <EcafeButton caption='Setup Database' clickHandler={handleSetupDatabase}/>
                            </div>
                            <div className="col-span-1">
                                <HoverInfo title="Initialise" message='Setup the starting data.' nextline='(e.g. Services/Actions/...)' />
                            </div>
                        </div>

                        <div className="grid grid-cols-8 items-center space-x-2">
                            <div className="col-span-1">
                                <EcafeButton caption='Load Countries' clickHandler={handleLoadCountries}/>
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