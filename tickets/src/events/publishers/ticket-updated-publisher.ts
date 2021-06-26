import { Publisher, Subjects, TicketUpdatedEvent } from "@mikeyimgittix/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
