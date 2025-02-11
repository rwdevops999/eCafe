import prisma from "@/lib/prisma";
import { TaskType } from "@/types/ecafe";
import { NextRequest } from "next/server";

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

    const task = await createTask(_data);

    return new Response(JSON.stringify(task), {
      headers: { "content-type": "application/json" },
      status: 201,
   });

}

export async function GET(request: NextRequest) {
    const tasks = await prisma.task.findMany();

    return Response.json(tasks.sort((a, b) => a.createDate!.getTime() - b.createDate!.getTime()));
}
