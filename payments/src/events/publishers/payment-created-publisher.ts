import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from "@mikeyimgittix/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
