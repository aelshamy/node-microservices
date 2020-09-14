import { BasePublisher, OrderCancelledEvent, Subjects } from '@ajmoro/common';

export class OrderCancelledPublisher extends BasePublisher<
  OrderCancelledEvent
> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
