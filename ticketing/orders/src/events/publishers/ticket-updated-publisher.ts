import { BasePublisher, Subjects, TicketUpdatedEvent } from '@ajmoro/common';

export class TicketUpdatedPublisher extends BasePublisher<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
