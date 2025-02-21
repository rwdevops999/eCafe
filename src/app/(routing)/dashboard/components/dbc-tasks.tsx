import { DataTable } from "@/components/datatable/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConsoleLogger } from "@/lib/console.logger";
import { handleLoadOpenTasks, handleLoadTasks } from "@/lib/db";
import { mapTasksToData } from "@/lib/mapping";
import { cn } from "@/lib/utils";
import { Data, TaskData, TaskType } from "@/types/ecafe";
import { useEffect, useState } from "react";
import { columns } from "./table/colums";
import EcafeLoader from "@/components/ecafe/ecafe-loader";
import { useDebug } from "@/hooks/use-debug";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckedState } from "@radix-ui/react-checkbox";

const DbcTasks = ({className = ""}:{className?:string}) => {
  const {debug} = useDebug();
  
  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  const [loader, setLoader] = useState<boolean>(false);

  const [tasksData, setTasksData] = useState<TaskData[]>([]);
  const tasksLoadedCallback = (data: any) => {
    logger.debug("DbcTask", "tasks loaded", JSON.stringify(data));
    if (data.status === 200) {
      const tasks: TaskType[] = data.payload;
      
      setTasksData(mapTasksToData(tasks, 5));
    }
    setLoader(false);
  }

  const loadTasks = () => {
    setLoader(true);
    handleLoadTasks(tasksLoadedCallback);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  const loadOpenTasks = (checked: CheckedState) => {
    let allTasks: boolean = true;

    if (typeof checked === 'boolean') {
      allTasks = checked;
    }


    setLoader(true);
    if (checked) {
      handleLoadOpenTasks(tasksLoadedCallback);
    } else {
      handleLoadTasks(tasksLoadedCallback);
    }
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="-mt-3 h-6">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-md">Tasks</CardTitle>
          <Label htmlFor="opentasks">Only open tasks</Label>
          <Checkbox id="opentasks" onCheckedChange={loadOpenTasks}></Checkbox>
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