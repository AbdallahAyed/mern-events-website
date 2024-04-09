"use server";

import { db } from "@/lib/db";
import { handleError } from "@/lib/utils";
import { EventParams } from "@/types";
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
