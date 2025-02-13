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
import { CheckedState } from "@radix-ui/react-checkbox";

import { CalendarDays, MailCheck, MailOpen } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { ActionExecutionType, ActionFunction, actionFunctions } from "../data/taskInfo";

/**
 * Functions can't be stored in the database, so we need to store them in a .ts file
 */
// FOR NOW UNTIL ALL IS KNOW, HARDCODED

const Task = ({taskId = 0, handleDialogClose}:{taskId?: number; handleDialogClose(): void;}) => {
  const {debug} = useDebug();
  const logger = new ConsoleLogger({ level: (debug ? 'debug' : 'none')});

  const [selectedTask, setSelectedTask] = useState<TaskType|undefined>(undefined);
  const [selectedTaskAction, setSelectedTaskAction] = useState<ActionFunction|undefined>(undefined);
  const [related, setRelated] = useState<boolean>(true);

  const taskToExecute = useRef<string|undefined>(undefined);

  const taskLoadedCallback = (_response: any) => {
    // logger.debug("Task", "taskLoadedCallback", "Reponse received", JSON.stringify(_response));
    console.log("Task", "taskLoadedCallback", "Reponse received", JSON.stringify(_response));

    if (_response.status === 200) {
      const task: TaskType = _response.payload;
      
      logger.debug("Task", "taskLoadedCallback(task)", JSON.stringify(task));
      setSelectedTask(task);

      const actionFunction: ActionFunction|undefined = actionFunctions.find((action) => action.action === task.name)
      logger.debug("Task", "taskLoadedCallback(actionFunction)", JSON.stringify(actionFunction));

      if (actionFunction) {
        logger.debug("Task", "taskLoadedCallback", "SetInfo");
        setSelectedTaskAction(actionFunction);
        taskToExecute.current = actionFunction.id.toString();
      }
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
      {selectedTask && <Badge variant="secondary" className={cn(selectedTask.status === 'open' ? "text-red-500" : "text-green-500", "animate-caret-blink cursor-default hover:bg-secondary rounded-xl")}>{selectedTask.status}</Badge>}
      {selectedTask && (selectedTask.status === 'open') ? <MailOpen className="text-red-500 animate-caret-blink" width={16} height={16}/> : <MailCheck className="text-green-500" width={16} height={16}/>}
    </div>
    );
  }

  const isTaskOpen = (): boolean => {
    return (selectedTask && selectedTask.status === 'open' ? true : false);
  }

  const handleChangeTaskAction = (taskActionId: string): void => {
    logger.debug("Task", "handleChangeTaskAction", taskActionId);

    const id: number = parseInt(taskActionId);

    const taskAction: ActionFunction|undefined = actionFunctions.find(action => action.id === id);

    setSelectedTaskAction(taskAction);
  }

  const changeRelated = (checked: CheckedState) => {
    if (typeof checked === 'boolean') {
      setRelated(checked);
    }
  }

  const handleExecute = () => {
    logger.debug("Task", "Execute(selectedTask, related) ...", JSON.stringify(selectedTaskAction), related);

    // execute function of selectedTaskAction (with related flag)
    // using selectedTask.subjectId and selectedTask.used flag and related flag

    logger.debug("Task", "... on", JSON.stringify(selectedTask));

    if (selectedTask && (selectedTaskAction?.type === selectedTask.subject) && (selectedTaskAction?.action === selectedTask.name)) {
      const actionExection: ActionExecutionType = {
        taskId: selectedTask?.id!,
        subjectId: selectedTask?.subjectId!,
        related: related
      }

      if (selectedTaskAction) {
        selectedTaskAction.func(actionExection);
      } else {
        logger.debug("Task", "NO TASK SELECTED");
      }

    } else {
      logger.debug("Task", "EXECUTION NOT ALLOWED");
    }

    handleClose();
  }

  const handleClose = () => {
    handleDialogClose();
  }

  const handleTaskSelect = (value: string) => {
    logger.debug("Task", "handleTaskSelect(value)", value);
    handleChangeTaskAction(value);
    taskToExecute.current = value;
  };

  return (
    <div className="-m-5 min-w-[100%] h-[80%]">
      <Card className="w-full h-full">
        <CardHeader className="w-[100%] min-h-[20%] border border-foreground/20 rounded-sm bg-foreground/20">
          <CardTitle className="flex justify-between cursor-default">
            <div>
              Task
            </div>
            <div>
              Status
            </div>
          </CardTitle>
          <CardDescription>
            <div className="flex justify-between items-center cursor-default">
              <div className="text-orange-400">
                {padZero(taskId, 5, 'TSK')}
              </div>
              <div>
                <TaskStatus />
              </div>
              </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full min-h-[95%] border border-foreground/50 rounded-sm bg-foreground/50">
          <div className="block space-y-1">
            <ShowCreationDate />
            <div className="flex items-center">
              <Label className="text-background">Action to take: <Badge className="ml-2 hover:bg-secondary" variant="secondary" >{selectedTask?.name}</Badge></Label>
            </div>
            <div className="flex items-start space-x-5">
              <Label htmlFor="description" className="text-background mr-2">Description:</Label>
              <Textarea id="description" className="w-full h-[100px] resize-none text-background" defaultValue={selectedTask?.description} disabled/>
            </div>
              <div className="flex items-center space-x-5">
                <Label className="text-background mr-10">Action:</Label>
                <Select
                  value = {selectedTaskAction?.id.toString()}
                  onValueChange={(value) => {
                    handleTaskSelect(value);
                  }}
                >
                  <SelectTrigger className="text-background w-[90%]">
                    <SelectValue placeholder="select an action ..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Actions</SelectLabel>
                        {actionFunctions.map((action) =>
                            <SelectItem key={action.id} value={action.id.toString()}>{action.action}</SelectItem>
                          )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-5 text-background">
                <Checkbox 
                  className="ml-[103px] border-background" 
                  id="related" 
                  checked={related}
                  onCheckedChange={changeRelated}
                />
                  <Label>repeat on related tasks</Label>
              </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end min-h-[10px] items-end w-full border border-foreground/20 rounded-sm bg-foreground/20">
          <div className="pt-3" >
            {isTaskOpen() && 
            <div className="flex space-x-2">
            <EcafeButton caption="close" clickHandler={handleClose}/>
            <EcafeButton caption="Execute" clickHandler={handleExecute}/>
            </div>}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Task