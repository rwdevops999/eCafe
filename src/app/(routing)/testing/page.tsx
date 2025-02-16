'use client'

import { createTask, handleDeleteExpiredTasks, handleLoadTestTasks } from "@/lib/db";
import { js } from "@/lib/utils";
import { ApiResponseType } from "@/types/db";
import { TaskType } from "@/types/ecafe";
import { useEffect } from "react";

const Test = () => {

  const testTasksLoaded = (_data: ApiResponseType) => {
    console.log ("TEST TASKS = " + js(_data.payload));
  }

  const deletedExpiredTasksCallback = (_data: ApiResponseType) => {
    console.log ("Deleted TEST TASKS = " + js(_data.payload));
  }

  const ftest = () => {
    // const date: Date = new Date();
    // var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    // const dateUTC: Date = new Date(now_utc);

    // console.log("UTC date = " + dateUTC.toString());

    // const task: TaskType = {
    //   id: -1,
    //   name: "DateTest3",
    //   description: "testing date",
    //   status: "open",
    //   subject: "TEST3",
    //   subjectId: null,
    //   createDate: new Date(Date.now()),
    //   updateDate: new Date(Date.now())
    // }

    // createTask(task, () => {});

    // handleLoadTestTasks(testTasksLoaded)
    // var expiredate_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours()+1, date.getUTCMinutes(), date.getUTCSeconds());
    // const expireUTC: Date = new Date(expiredate_utc);
    // console.log("expireUTC date = " + expireUTC.toString());

    // handleDeleteExpiredTasks(deletedExpiredTasksCallback);
    // handleLoadTestTasks(testTasksLoaded)
  }

  useEffect(() => {
    ftest();
  }, [])


  const renderComponent = () => {
    return (<></>);
    };

  return (<>{renderComponent()}</>);
}

export default Test;