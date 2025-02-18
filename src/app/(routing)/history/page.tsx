'use client'

import { DataTable } from "@/components/datatable/data-table";
import EcafeLoader from "@/components/ecafe/ecafe-loader";
import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import PageTitle from "@/components/ecafe/page-title";
import { Separator } from "@/components/ui/separator";
import { useDebug } from "@/hooks/use-debug";
import { ConsoleLogger } from "@/lib/console.logger";
import { handleLoadHistory } from "@/lib/db";
import { mapHistoryToData } from "@/lib/mapping";
import { HistoryData, HistoryType } from "@/types/ecafe";
import { useEffect, useState } from "react";
import { columns } from "./table/colums";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { ApiResponseType } from "@/types/db";
import { js, showToast } from "@/lib/utils";
import { toast } from "sonner";

const History = () => {
    const {debug} = useDebug();
    const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

    const [loader, setLoader] = useState<boolean>(false);

    const [mappedHistory, setMappedHistory] = useState<HistoryData[]>([]);

    const historyLoadedCallback = (_data: ApiResponseType): void => {
        if (_data.status === 200) {
            const history: HistoryType[] = _data.payload;

            setMappedHistory(mapHistoryToData(history));
            showToast("info", "History loaded");
        }

        setLoader(false);
    }

    useEffect(() => {
        setLoader(true);
        handleLoadHistory(historyLoadedCallback);
    }, []);

    const renderComponent = () => {
        return (
            <div className="w-full h-full rounded-lg">
                <PageBreadCrumbs crumbs={[{name: "ecafé", url: "/"}, {name: "history"}]} />
                <div className="flex space-x-2 items-center">
                    <PageTitle title="History" className="m-2"/>
                    <EcafeLoader className={loader ? "" : "hidden"}/>
                    </div>
                <Separator className="mb-1"/>
                <DataTable data={mappedHistory} columns={columns} Toolbar={DataTableToolbar}/>
            </div>
        );
    };
  
    return (<>{renderComponent()}</>);
}

export default History