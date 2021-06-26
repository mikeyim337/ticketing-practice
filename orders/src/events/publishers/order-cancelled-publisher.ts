import {
  Subjects,
  Publisher,
  OrderCancelledEvent,
} from "@mikeyimgittix/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
