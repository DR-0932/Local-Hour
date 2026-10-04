import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { createEvent } from "@/lib/controllers/adminControllers";
import {revalidateTag} from "next/cache";

export async function POST(req:Request){
  const admin = await getAdmin();
  if(admin.status !==200){
    return NextResponse.json({error:"Forbidden"}, {status:admin.status})
  }
  const body = await req.json().catch(()=>null);
  const result = await createEvent(body);

  if(result.status>=200 && result.status<300){
    revalidateTag("events","max")
  }
  return NextResponse.json(result.data,{status:result.status})

}