'use client'

import EcafeButton from '@/components/ecafe/ecafe-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDebug } from '@/hooks/use-debug';
import { ConsoleLogger } from '@/lib/console.logger';
import { createHistory, initDB } from '@/lib/db';
import { createHistoryType, js } from '@/lib/utils';
import { History } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';
import HoverInfo from './hover-info';

const SettingsHistory = () => {
    const {debug} = useDebug();
    const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none') });

    const historyCleared = (data: any) => {
        logger.debug("History", "handleClearHistory", js(data));
        createHistory(createHistoryType("info", "History Cleared", "Cleared the history data", "Settings[History]"), () => {})
        toast.success("History cleared.", {duration: 1000})
    }
    
    const handleClearHistory = (_dummy: boolean): void => {
        logger.debug("History", "handleClearHistory");
    
        initDB('History', historyCleared);
    }
    
    const renderComponent = () => {
        return (
            <Card className="w-full h-[30%] border-foreground/30">
                <CardHeader>
                    <div className="flex space-x-2 items-center">
                        <History />
                        <CardTitle>History</CardTitle>
                    </div>
                    <CardDescription>History settings.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='space-y-2'>
                        <div>
                            <div className="grid grid-cols-8 items-center space-x-2">
                                <div className="col-span-1">
                                    <EcafeButton caption='Clear History' clickHandler={handleClearHistory}/>
                                </div>
                                <div className="col-span-1">
                                    <HoverInfo title="Clear History" message='Clear the history database.' />
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

export default SettingsHistory;