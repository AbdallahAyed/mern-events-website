import { Event, Prisma } from "@prisma/client";

export type EventWithOrganizer = Prisma.EventGetPayload<{
  include: { organizer: true; category: true };
}>;

export type EventParams = {
  userId: string;
  event?: Event;
  path: string;
};

export type SearchParamProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export type GetRelatedEventsByCategoryParams = {
  categoryId: number;
  eventId: number;
  limit?: number;
  page: number | string;
};

// ====== URL QUERY PARAMS
export type UrlQueryParams = {
  params: string;
  key: string;
  value: string | null;
};
