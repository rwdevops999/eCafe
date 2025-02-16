import prisma from "@/lib/prisma";
import { createApiResponse, stringToBoolean } from "@/lib/utils";
import { TaskType } from "@/types/ecafe";
import { NextRequest, NextResponse } from "next/server";

const createTask = async (data: TaskType) => {
    let task: any;
  
     await prisma.task.create({
      data: {
        name: data.name,
        description: data.description,
        subject: data.subject,
        subjectId: data.subjectId??0,
        status: data.status
      }
    }).then((response) => {
      task = response;
    })
  
    return task;
  }
  
  export async function POST(req: NextRequest) {
    const _data: TaskType = await req.json();

    console.log("API CreateTask: ", JSON.stringify(_data));
    
    const task: TaskType = await createTask(_data);

    return Response.json(createApiResponse(201, "Payload: TaskType", task));
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const test = searchParams.get('test');  // passed as ...?service=Stock => service = "Stock"
  const open = searchParams.get('open');  // passed as ...?service=Stock => service = "Stock"
  const taskId = searchParams.get('taskId');  // passed as ...?service=Stock => service = "Stock"

  if (test) {
    const tasks: TaskType[] = await prisma.task.findMany({
      where: {
        createDate: {
          lt: new Date(Date.now() - 15 * 60 * 1000)
        }
      }
    });

    if (tasks) {
      console.log("API Task = " + JSON.stringify(tasks));

      return Response.json(createApiResponse(200, "Payload: TaskType[]", tasks));
    }

    return Response.json(createApiResponse(404, "Task not found"));
  }
  
  if (taskId) {
    const task: TaskType | null = await prisma.task.findFirst({
      where: {
        id: parseInt(taskId)
      }
    });

    if (task) {
      console.log("API Task = " + JSON.stringify(task));

      return Response.json(createApiResponse(200, "Payload: TaskType", task));
    }

    return Response.json(createApiResponse(404, "Task not found"));
  }
  
  let tasks: TaskType[] = [];

  if (open && stringToBoolean(open)) {
    tasks = await prisma.task.findMany({where: {status: "open"}});
  } else {
    tasks = await prisma.task.findMany();
  }

  return Response.json(createApiResponse(200, "Payload: TaskType[]", tasks.sort((a, b) => a.createDate!.getTime() - b.createDate!.getTime())));
}

export async function PUT(request: NextRequest) {
const searchParams = request.nextUrl.searchParams

const _taskId = searchParams.get('taskId');  // passed as ...?service=Stock => service = "Stock"
const _status = searchParams.get('status');  // passed as ...?service=Stock => service = "Stock"

  console.log("[API] Task Id: " + _taskId);
  console.log("[API] Status: " + _status);

  if (_taskId && _status) {
    const updatedTask = await prisma.task.update({
      where: {
        id: parseInt(_taskId)
      },
      data: {
        status: _status
      }
    });

    return NextResponse.json(updatedTask);
  }

  return new Response("Parameters Error", {
    headers: { "content-type": "application/json" },
    status: 400,
 });
}
