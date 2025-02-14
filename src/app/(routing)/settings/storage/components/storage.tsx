'use client'

import EcafeButton from '@/components/ecafe/ecafe-button';
import PageTitle from '@/components/ecafe/page-title';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useDebug } from '@/hooks/use-debug';
import { ConsoleLogger } from '@/lib/console.logger';
import { handleClearDB, initDB } from '@/lib/db';
import { Database } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'sonner';

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
        toast("Database initialised.")
    }

    const handleSetupDatabase = (_dummy: boolean): void => {
        logger.debug("Storage", "handleSetupDatabase");

        initDB('*', databaseInitialised);
    }

    const countriesLoaded = () => {
        toast("Countries loaded.")
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
                            <div className="grid grid-cols-8">
                                <div className="col-span-1">
                                    <EcafeButton caption='Clear Database' clickHandler={handleClearDatabase}/>
                                </div>
                                <div className="col-span-1">
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
                            <div className="grid grid-cols-8">
                                <div>
                                    <EcafeButton caption='Setup Database' clickHandler={handleSetupDatabase}/>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="grid grid-cols-8">
                                <div>
                                    <EcafeButton caption='Load Countries' clickHandler={handleLoadCountries}/>
                                </div>
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