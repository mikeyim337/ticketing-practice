import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@mikeyimgittix/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
