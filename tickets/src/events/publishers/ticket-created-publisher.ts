import { Publisher, Subjects, TicketCreatedEvent } from "@mikeyimgittix/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
