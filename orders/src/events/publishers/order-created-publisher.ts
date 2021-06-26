import { Publisher, OrderCreatedEvent, Subjects } from "@mikeyimgittix/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
