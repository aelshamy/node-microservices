import { BaseListener, Subjects, TicketCreatedEvent } from '@ajmoro/common';
import { Message } from 'node-nats-streaming';

export class TicketCreatedListener extends BaseListener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], message: Message): void {
    console.log('Event data!', data);

    console.log(data.id);
    console.log(data.title);
    console.log(data.price);
    console.log(data.userId);

    message.ack();
  }
}
