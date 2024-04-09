"use server";

import { db } from "@/lib/db";
import { handleError } from "@/lib/utils";
import {
  EventParams,
  GetAllEventsParams,
  GetRelatedEventsByCategoryParams,
} from "@/types";
import { revalidatePath } from "next/cache";

const getCategoryByName = async (name: string) => {
  return db.category.findUnique({
    where: {
      name: name,
    },
  });
};

// CREATE
export async function createEvent({ userId, event, path }: any) {
  try {
    const organizer = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!organizer) throw new Error("Organizer not found");

    const newEvent = await db.event.create({
      data: {
        ...event,
        categoryId: parseInt(event?.categoryId),
        organizerId: userId,
      },
    });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteEvent({ eventId, path }: any) {
  try {
    const deletedEvent = await db.event.delete({
      where: {
        id: eventId,
      },
    });

    if (deletedEvent) revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

// GET ONE EVENT BY ID
export async function getEventById(eventId: number) {
  try {
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        organizer: { select: { id: true, firstName: true, lastName: true } },
        category: { select: { id: true, name: true } },
      },
    });

    if (!event) throw new Error("Event not found");

    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    handleError(error);
  }
}

// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    const skipAmount = (Number(page) - 1) * limit;

    const events = await db.event.findMany({
      where: {
        AND: [{ categoryId }, { id: { not: eventId } }],
      },
      include: {
        organizer: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
      skip: skipAmount,
      take: limit,
    });

    const eventsCount = await db.event.count({
      where: {
        AND: [{ categoryId }, { id: { not: eventId } }],
      },
    });

    return { data: events, totalPages: Math.ceil(eventsCount / limit) };
  } catch (error) {
    handleError(error);
  }
}

// GET ALL EVENTS
export async function getAllEvents({
  query,
  limit,
  page,
  category,
}: GetAllEventsParams) {
  const skip = (page - 1) * limit;

  const events = await db.event.findMany({
    where: {
      title: { contains: query, mode: "insensitive" }, // Adjust filtering based on your needs
      category: category ? { name: category } : undefined,
    },
    include: {
      organizer: true,
      category: true,
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });

  const eventsCount = await db.event.count({
    where: {
      title: { contains: query, mode: "insensitive" }, // Adjust filtering based on your needs
      category: category ? { name: category } : undefined,
    },
  });

  return {
    data: events,
    totalPages: Math.ceil(eventsCount / limit),
  };
}
