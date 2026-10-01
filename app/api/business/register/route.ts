import {NextResponse} from "next/server";
import { register_for_free_event } from "@/lib/controllers/businessControllers";

export async function POST(req:Request){
    const body =  await req.json();
    const result = await register_for_free_event(body);
    return NextResponse.json(result.data,{status:result.status})
}