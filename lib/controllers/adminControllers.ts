import { prisma } from "@/lib/prisma";

export async function createEvent(body: any) {
  const { title, 
    description, 
    startTime, 
    endTime, 
    venue, 
    venueLink,
    numberOfParticipants, 
    image, 
    registrationFee } = body ?? {};

  if (!title || !description || !startTime || !endTime || !venue || !image){
      return { status: 400, data: { error: "Missing required fields" } };
  }

  const start = new Date(startTime);
  const end = new Date(endTime);
  const slots = Number(numberOfParticipants);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start){
      return { status: 400, data: { error: "Invalid start or end time" } };
  }
  if (!Number.isInteger(slots) || slots < 1){
      return { status: 400, data: { error: "Invalid number of participants" } };
  }

  try {
    const event = await prisma.event.create({
      data: {
        title, 
        description, 
        startTime: start, 
        endTime: end, 
        venue, 
        venueLink,
        numberOfParticipants: slots, 
        slotsLeft: slots, 
        image,
        registrationFee: Number(registrationFee) || 0,
      },
    });
    return { status: 201, data: { message: "Successfully created", event } };
  
} catch (err) {
    console.error("Create Event Error:", err);
    return { status: 500, data: { error: "Internal server error" } };
  }
}

export async function deleteEvent(id: string) {
  if (!id){
    return { status: 400, data: { error: "Event ID is required" } };
  } 
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      select: {
        id: true,
        _count: { select: { registrations: true, transactions: true } },
      },
    });

    if (!event) {
      return { status: 404, data: { error: "Event not found" } };
    }

    if (event._count.registrations > 0 || event._count.transactions > 0) {
      await prisma.event.update({
        where: { id },
        data: { isArchived: true },
      });

      return {
        status: 200,
        data: {
          message: "Event archived because it has registrations or transactions",
        },
      };
    }

    await prisma.event.delete({ where: { id } });
    
    return { 
        status: 200, 
        data: { 
            message: "Event deleted successfully",
        } };
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2003"
    ) {
      // A registration or transaction may have been created after the count.
      try {
        await prisma.event.update({
          where: { id },
          data: { isArchived: true },
        });
        return {
          status: 200,
          data: {
            message: "Event archived because it has registrations or transactions",
          },
        };
      } catch (archiveError) {
        if (
          typeof archiveError === "object" &&
          archiveError !== null &&
          "code" in archiveError &&
          archiveError.code === "P2025"
        ) {
          return { status: 404, data: { error: "Event not found" } };
        }
        console.error("Archive Event Error:", archiveError);
        return { status: 500, data: { error: "Internal server error" } };
      }
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return { status: 404, data: { error: "Event not found" } };
    }
    
    console.error("Delete Event Error:", error);
    
    return { status: 500, data: { error: "Internal server error" } };
  }
}

export async function getParticipants(id: string) {
  if (!id) {
    return { status: 400, data: { error: "Event ID is required" } }
    };
  try {
    const participant_data = await prisma.registration.findMany({
      where: { eventId: id },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        phone: true, 
        userId: true, 
        createdAt: true 
    },
      orderBy: { createdAt: "desc" },
    });
    return { status: 200, data: { count: participant_data.length, participant_data } };
  } catch (err) {
    console.error(err);
    return { status: 500, data: { error: "internal server error" } };
  }
}


export async function rescheduleEvent(id: string, body: any) {
  const start = new Date(body?.startTime);
  const end = new Date(body?.endTime);
 
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start){
      return { status: 400, data: { error: "Invalid start or end time" } };
  }

  try {
    const event = await prisma.event.update({
      where: { id },
      data: { 
        startTime: start,
        endTime: end
    },
    });
    return { status: 200, data: { message: "Event rescheduled successfully", event } };
  
} catch (e: any) {
    if (e?.code === "P2025") return { status: 404, data: { error: "Event not found" } };
    console.error(e);
    return { status: 500, data: { error: "Internal server error" } };
  }
}

export async function hideEvent(id: string) {
  try {
    const event = await prisma.event.update({
      where: { id },
      data: { isArchived: true },
    });
    return { status: 200, data: { message: "Event hidden successfully", event } };
  } catch (e: any) {
    if (e?.code === "P2025") return { status: 404, data: { error: "Event not found" } };
    console.error(e);
    return { status: 500, data: { error: "Internal server error" } };
  }
}
