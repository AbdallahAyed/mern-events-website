import { Event, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export type EventWithOrganizer = Prisma.EventGetPayload<{
  include: {
    organizer: {
      select: { id: true; firstName: true; lastName: true };
    };
    category: {
      select: { id: true; name: true };
    };
  };
}>;

export type EventParams = {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  imageUrl: string;
  startDateTime: Date;
  endDateTime: Date;
  price: string;
  url: string;
  isFree: boolean;
  categoryId: string;
};

export type GetAllEventsParams = {
  query: string;
  category: string;
  limit: number;
  page: number;
};

export type GetRelatedEventsByCategoryParams = {
  categoryId: number;
  eventId: number;
  limit?: number;
  page: number | string;
};

export type GetEventsByUserParams = {
  userId: string | null;
  limit?: number;
  page: number;
};

// ====== ORDER PARAMS
export type CheckoutOrderParams = {
  eventTitle: string;
  eventId: number;
  price: Decimal | null;
  isFree: boolean;
  buyerId: string;
};

export type CreateOrderParams = {
  stripeId: string;
  eventId: string;
  buyerId: string;
  totalAmount: string;
  createdAt: Date;
};
// ====== URL QUERY PARAMS
export type UrlQueryParams = {
  params: string;
  key: string;
  value: string | null;
};

export type SearchParamProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
