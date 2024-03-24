"use server";

import { db } from "@/lib/db";
import { handleError } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export const createUser = async (user: any) => {
  try {
    const newUser = await db.user.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
};

export async function getUserById(userId: number) {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new Error("User not found");
    return user;
  } catch (error) {
    handleError(error);
  }
}

export const updateUser = async (clerkId: string, user: any) => {
  try {
    await db.user.update({
      where: { clerkId },
      data: { ...user, new: true },
    });
  } catch (error) {
    handleError(error);
  }
};

export const deleteUser = async (clerkId: string) => {
  try {
    // Find user to delete
    const userToDelete = await db.user.findUnique({
      where: {
        clerkId: clerkId,
      },
      include: {
        events: true,
        orders: true,
      },
    });
    if (!userToDelete) throw new Error("User not found");

    await Promise.all([
      ...userToDelete.events.map((event) =>
        db.event.update({
          where: {
            id: event.id,
          },
          data: {
            organizer: {
              disconnect: true, // Disconnecting the organizer relationship
            },
          },
        })
      ),
      ...userToDelete.orders.map((order) =>
        db.order.update({
          where: {
            id: order.id,
          },
          data: {
            buyer: {
              disconnect: true,
            },
          },
        })
      ),
    ]);

    const deletedUser = await db.user.delete({
      where: {
        clerkId: clerkId,
      },
    });

    revalidatePath("/");

    return deletedUser;
  } catch (error) {
    handleError(error);
  }
};
