import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma";

export const getUpcomingEvents = unstable_cache(
    async ()=> {
        const events = await prisma.event.findMany({
            where:{
                isArchived: false
            },
            orderBy:{
                startTime:"asc"
            },
        });
        return events.map((e)=>({
            ...e,
            registrationFee: e.registrationFee.toNumber(),
            startTime:       e.startTime.toISOString(),
            endTime:         e.endTime.toISOString(),
            createdAt:       e.createdAt.toISOString(),
        }));
    },
    ["event-upcoming"],
    {tags:["events"], revalidate:3600 }
);

export const getEventId = (id:string) => unstable_cache( 
    async ()=>{
        const e = await prisma.event.findUnique({
            where:{id}
        });
        
        if (!e) return null;
        return{
            ...e,
            registrationFee:e.registrationFee.toNumber(),
            startTime:      e.startTime.toISOString(),
            endTime:        e.endTime.toISOString(),
            createdAt:      e.createdAt.toISOString(),
        };
    },
    ["event",id],
    {tags: ["events",`event-${id}`],revalidate:14400}
)();