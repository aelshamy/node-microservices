import { BaseListener, Subjects, TicketCreatedEvent } from '@ajmoro/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends BaseListener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: TicketCreatedEvent['data'],
    message: Message
  ): Promise<void> {
    const { title, price, id } = data;

    const ticket = Ticket.build({ id, title, price });
    await ticket.save();
    message.ack();
  }
}
