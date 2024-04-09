import { Event } from "@prisma/client";

export type EventParams = {
  userId: string;
  event?: Event;
  path: string;
};

export type SearchParamProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
