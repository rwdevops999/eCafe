'use client'

import { DataTable } from "@/components/datatable/data-table";
import EcafeLoader from "@/components/ecafe/ecafe-loader";
import PageBreadCrumbs from "@/components/ecafe/page-bread-crumbs";
import PageTitle from "@/components/ecafe/page-title";
import { Separator } from "@/components/ui/separator";
import { useDebug } from "@/hooks/use-debug";
import { ConsoleLogger } from "@/lib/console.logger";
import { handleLoadTasks } from "@/lib/db";
import { mapTasksToData } from "@/lib/mapping";
import { TaskData, TaskType } from "@/types/ecafe";
import { useEffect, useState } from "react";
import { columns } from "./table/colums";
import { DataTableToolbar } from "./table/data-table-toolbar";

const Task = () => {
    const {debug} = useDebug();
    const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

      const [loader, setLoader] = useState<boolean>(false);

    const [mappedTasks, setMappedTasks] = useState<TaskData[]>([]);

    const tasksLoadedCallback = (data: any): void => {
        logger.debug("TEST", "tasksLoadedCallback", JSON.stringify(data));
        if (data.status === 200) {
        const tasks: TaskType[] = data.payload;

        setMappedTasks(mapTasksToData(tasks));
        } else {
        logger.debug("TEST", "tasksLoadedCallback", "Error", data.payload);
        }

        setLoader(false);
    }

    useEffect(() => {
        logger.debug("TEST", "UserEffect[]");
        setLoader(true);
        handleLoadTasks(tasksLoadedCallback);
    }, []);

    const renderComponent = () => {
        return (
            <div className="w-full h-full rounded-lg">
                <PageBreadCrumbs crumbs={[{name: "ecafé", url: "/"}, {name: "tasks"}]} />
                <div className="flex space-x-2 items-center">
                    <PageTitle title="Tasks" className="m-2"/>
                    <EcafeLoader className={loader ? "" : "hidden"}/>
                    </div>
                <Separator className="mb-1"/>
                <DataTable data={mappedTasks} columns={columns} Toolbar={DataTableToolbar}/>
            </div>
        );
    };
  
    return (<>{renderComponent()}</>);
  }

export default Task;
