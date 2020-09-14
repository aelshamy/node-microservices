import { BasePublisher, PaymentCreatedEvent, Subjects } from '@ajmoro/common';

export class PaymentCreatedPublisher extends BasePublisher<
  PaymentCreatedEvent
> {
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
