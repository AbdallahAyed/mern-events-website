import { Event } from "@prisma/client";

export type EventParams = {
  userId: string;
  event?: Event;
  path: string;
};
