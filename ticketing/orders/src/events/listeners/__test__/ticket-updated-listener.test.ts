import { TicketCreatedEvent } from '@ajmoro/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'a concert',
    price: 10,
  });
  await ticket.save();

  const data: TicketCreatedEvent['data'] = {
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: ticket.version + 1,
  };

  //@ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    ticket,
    data,
    message,
  };
};
it('find updates and save ticket', async () => {
  const { listener, ticket, data, message } = await setup();

  await listener.onMessage(data, message);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.version).toEqual(data.version);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);

  expect(message.ack).toHaveBeenCalled();
});
it('does not call ack if the event has skipped version number', async () => {
  const { listener, ticket, data, message } = await setup();
  data.version = 10;
  try {
    await listener.onMessage(data, message);
    throw new Error('should not reach this point');
  } catch (error) {}
  expect(message.ack).not.toHaveBeenCalled();
});
