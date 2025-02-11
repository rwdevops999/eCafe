import { DataTable } from "@/components/datatable/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConsoleLogger } from "@/lib/console.logger";
import { handleLoadTasks } from "@/lib/db";
import { mapTasksToData } from "@/lib/mapping";
import { cn } from "@/lib/utils";
import { Data, TaskData, TaskType } from "@/types/ecafe";
import { useEffect, useState } from "react";
import { columns } from "./table/colums";
import EcafeLoader from "@/components/ecafe/ecafe-loader";

const logger = new ConsoleLogger({level: "debug"});

const DbcTasks = ({className = ""}:{className?:string}) => {
  const [loader, setLoader] = useState<boolean>(false);

  const [tasksData, setTasksData] = useState<TaskData[]>([]);
  const tasksLoadedCallback = (tasks: TaskType[]) => {
    logger.debug("DbcTask", "tasks loaded", JSON.stringify(tasks));
    setTasksData(mapTasksToData(tasks));
    setLoader(false);
  }

  const loadTasks = () => {
    setLoader(true);
    handleLoadTasks(tasksLoadedCallback);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <Card className={cn("", className)}>
      <CardHeader className="-mt-3 h-6">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-md">Tasks</CardTitle>
          <EcafeLoader className={loader ? "h-4 w-4" : "hidden"}/>
        </div>
      </CardHeader>
      <CardContent className="-mb-[50px]">
        <DataTable data={tasksData} columns={columns} pagination={false}/>
      </CardContent>
    </Card>
  )
}

export default DbcTasks;