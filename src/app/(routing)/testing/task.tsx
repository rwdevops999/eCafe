'use client'

import EcafeButton from "@/components/ecafe/ecafe-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { months } from "@/data/constants";
import { useDebug } from "@/hooks/use-debug";
import { ConsoleLogger } from "@/lib/console.logger";
import { handleLoadTask } from "@/lib/db";
import { cn, padZero } from "@/lib/utils";
import { TaskType } from "@/types/ecafe";

import { CalendarDays, MailCheck, MailOpen } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

type TaskActionType = {
  id: number,
  type: string,
  action: string,
  payload: any|undefined
}

const taskActions: TaskActionType[] = [{
  id: 1,
  type: "OTP",
  action: "Remove OTP",
  payload: undefined
}]

// FOR NOW UNTIL ALL IS KNOW, HARDCODED
const Task = ({taskId = 0}:{taskId?: number}) => {
  const {debug} = useDebug();
  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  const [selectedTask, setSelectedTask] = useState<TaskType|undefined>(undefined);

  const taskLoadedCallback = (_response: any) => {
    logger.debug("Task", "taskLoadedCallback", "Reponse received", JSON.stringify(_response));

    if (_response.status === 200) {
      const task: TaskType = _response.payload;
      
      logger.debug("Task", "taskLoadedCallback(task)", JSON.stringify(task));
      setSelectedTask(task);
    }
  }

  useEffect(() => {
    logger.debug("Task", "UseEffect[taskId]", taskId);
    handleLoadTask(taskId, taskLoadedCallback);
  }, [taskId]);

  const renderCreationDateInfo = (dateValue: string|undefined): string => {
    if (dateValue) {
      const date = new Date(dateValue);

      return "created on: " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
    }

    return "unknown";
  }

  const ShowCreationDate = (): ReactNode => {
    return (
      <div className="mt-2 flex space-x-2 items-center">
        <CalendarDays className="text-background/70 h-4 w-4 opacity-70" />
        <Label className="text-sm text-background/70">{renderCreationDateInfo(selectedTask?.createDate)}</Label>
      </div>
    )
  }

  const TaskStatus = (): ReactNode => {
    return (
    <div className="flex items-center space-x-1">
      {selectedTask && <Badge variant="secondary" className={cn(selectedTask.status === 'open' ? "text-red-500" : "text-green-500", "rounded-xl")}>{selectedTask.status}</Badge>}
      {selectedTask && (selectedTask.status === 'open') ? <MailOpen className="text-red-500" width={16} height={16}/> : <MailCheck className="text-green-500" width={16} height={16}/>}
    </div>
    );
  }

  const isTaskOpen = (): boolean => {
    return (selectedTask && selectedTask.status === 'open' ? true : false);
  }

  return (
    <div className="flex justify-center items-center w-[100%] h-[100%] rounded-xl border border-foreground/50">
        <Card className="w-[50%] h-[50%]">
          <CardHeader className="w-full h-[20%] border border-foreground/20 rounded-sm bg-foreground/20">
              <CardTitle className="flex justify-between">
                <div>
                  Task
                </div>
                <div>
                  Status
                </div>
              </CardTitle>
              <CardDescription>
                <div className="flex justify-between items-center">
                  <div>
                    {padZero(taskId, 5, 'TSK')}
                  </div>
                  <div>
                    <TaskStatus />
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full h-[65%] border border-foreground/50 rounded-sm bg-foreground/50">
              <div className="block space-y-1">
                <ShowCreationDate />
                <div className="flex items-center">
                  <Label className="text-background">Action to take: <Badge className="ml-2" variant="secondary">{selectedTask?.name}</Badge></Label>
                </div>
                <div className="flex items-start space-x-5">
                  <Label htmlFor="description" className="text-background mr-2">Description:</Label>
                  <Textarea id="description" className="w-full h-[100px] resize-none text-background" defaultValue={selectedTask?.description} disabled/>
                </div>
                <div className="flex items-center space-x-5">
                  <Label className="text-background mr-10">Action:</Label>
                  <Select>
                    <SelectTrigger className="text-background w-[85%]">
                      <SelectValue placeholder="select an action ..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Actions</SelectLabel>
                        {taskActions.map((action) =>
                          <SelectItem key={action.id} value={action.id.toString()}>{action.action}</SelectItem>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-5 text-background">
                  <Checkbox className="ml-[103px] border-background" id="related"></Checkbox>
                  <Label>repeat on related tasks</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end items-center w-full h-[15%] border border-foreground/20 rounded-sm bg-foreground/20">
              <div className="mt-6" >
                {isTaskOpen() && <EcafeButton caption="Execute"/>}
              </div>
            </CardFooter>
        </Card>
    </div>
  )
}

export default Task