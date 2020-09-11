import { BasePublisher, OrderCreatedEvent, Subjects } from '@ajmoro/common';

export class OrderCreatedPublisher extends BasePublisher<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
