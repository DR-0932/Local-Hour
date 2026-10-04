import { prisma } from "@/lib/prisma";
import { event_registration_schema } from "@/lib/validation";

export async function getEvents() {
  try {
    const upcomingEvents = await prisma.event.findMany({
      where: { startTime: { gte: new Date() } },
      orderBy: { startTime: "asc" },
      include: { registrations: { select: { id: true } } },
    });
    const data = upcomingEvents.map((event) => ({
      ...event,
      registrationCount: event.registrations.length,
    }));
    return { status: 200, data };
  } catch (error) {
    console.error("error in getting events", error);
    return { status: 500, data: { error: "Failed to fetch upcoming events" } };
  }
}

export async function register_for_free_event(body: unknown) {
  const form_data = event_registration_schema.safeParse(body);
  if (!form_data.success) return { status: 400, data: { error: "Invalid input" } };

  const { contact_number, full_name, email, eventId } = form_data.data;

  try {
    const full = await prisma.$transaction(async (tx) => {
      const slot = await tx.event.updateMany({
        where: { id: eventId, slotsLeft: { gt: 0 } },
        data: { slotsLeft: { decrement: 1 } },
      });
      if (slot.count === 0) return true;

      await tx.registration.create({
        data: {
          name: full_name,
          email: email.toLowerCase().trim(),
          phone: contact_number,
          eventId,
        },
      });
      return false;
    });

    if (full) return { status: 409, data: { error: "Event is full" } };
    return { status: 201, data: { message: "Successfully registered" } };
  } catch (err) {
    if ((err as { code?: string })?.code === "P2002") {
      return { status: 409, data: { error: "Already registered for this event" } };
    }
    console.error("register_for_free_event error:", err);
    return { status: 500, data: { error: "Internal server error" } };
  }
}

export async function getEventById(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { registrations: { select: { id: true } } },
    });
    if (!event) return { status: 404, data: { error: "Event not found" } };
    return { status: 200, data: { ...event, registrationCount: event.registrations.length } };
  } catch (e) {
    console.error(e);
    return { status: 500, data: { error: "Internal server error" } };
  }
}