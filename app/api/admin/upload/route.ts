import {NextResponse} from "next/server";
import { v2 as cloudinary } from "cloudinary";
import {getAdmin} from "@/lib/auth";

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});


export async function POST(req:Request){
    const admin = await getAdmin();
    if(admin.status !==200){
        return NextResponse.json({error:"Forbidden"},{status:admin.status});
    }

    const form = await req.formData();
    const file = form.get("file") as File | null;
    if(!file || !file.type.startsWith("image/")){
        return NextResponse.json({error:"Invalid File"},{status:400});
    }
    if(file.size >4*1024*1024){
        return NextResponse.json({error:"Max 4mb"},{status:413})
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url  = await new Promise<string>((resolve,reject)=>{
        cloudinary.uploader
            .upload_stream({ folder:"events" }, (err , res ) =>
            err || !res ? reject(err) : resolve(res?.secure_url)
            )
            .end(buffer);
    })
    return NextResponse.json({ url })
}