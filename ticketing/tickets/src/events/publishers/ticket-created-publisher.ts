import { BasePublisher, Subjects, TicketCreatedEvent } from '@ajmoro/common';

export class TicketCreatedPublisher extends BasePublisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
