"use server";

import Stripe from "stripe";
import { redirect } from "next/navigation";

import { CheckoutOrderParams, CreateOrderParams } from "@/types";
import { handleError } from "@/lib/utils";
import { db } from "@/lib/db";

export const checkoutOrder = async (order: CheckoutOrderParams) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const price = order.isFree ? 0 : Number(order.price) * 100;

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: price,
            product_data: {
              name: order.eventTitle,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        eventId: order.eventId,
        buyerId: order.buyerId,
      },
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    });

    redirect(session.url!);
  } catch (error) {
    throw error;
  }
};

// CREATE
export const createOrder = async (order: CreateOrderParams) => {
  try {
    const newOrder = await db.order.create({
      data: {
        ...order,
      },
    });

    return JSON.parse(JSON.stringify(newOrder));
  } catch (error) {
    handleError(error);
  }
};

// GET ORDERS BY USER
export async function getOrdersByUser({
  userId,
  limit = 3,
  page,
}: {
  userId: string;
  limit?: number;
  page: number;
}) {
  try {
    const skipAmount = (Number(page) - 1) * limit;

    const orders = await db.order.findMany({
      where: { buyerId: userId },
      distinct: ["eventId"],
      include: {
        event: {
          include: {
            organizer: {
              select: {
                firstName: true,
                lastName: true,
                id: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: skipAmount,
      take: limit,
    });

    const ordersCount = await db.order.count({
      where: { buyerId: userId },
    });

    return { data: orders, totalPages: Math.ceil(ordersCount / limit) };
  } catch (error) {
    handleError(error);
  }
}
