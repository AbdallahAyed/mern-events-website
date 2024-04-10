import { getEventById } from "@/actions/event.actions";
import { EventForm } from "@/components/shared/EventForm";
import { auth } from "@clerk/nextjs";

type UpdateEventProps = {
  params: {
    id: string;
  };
};

export default async function UpdateEvent({
  params: { id },
}: UpdateEventProps) {
  const { userId } = auth();

  const event = await getEventById(parseInt(id));

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Update Event
        </h3>
      </section>

      <div className="wrapper my-8">
        <EventForm
          type="Update"
          event={event}
          eventId={event.id}
          userId={userId}
        />
      </div>
    </>
  );
}
