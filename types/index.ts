import { Event, Prisma } from "@prisma/client";

export type EventWithOrganizer = Prisma.EventGetPayload<{
  include: { organizer: true; category: true };
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
