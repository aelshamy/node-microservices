import { OrderCreatedEvent, OrderStatus } from '@ajmoro/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123',
  });
  await ticket.save();

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: '2222',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
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
it('sets the orderId of the ticket', async () => {
  const { listener, data, message } = await setup();

  await listener.onMessage(data, message);

  const updatedTicket = await Ticket.findById(data.ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  expect(message.ack).toHaveBeenCalled();
  const ticketUpdateData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(data.id).toEqual(ticketUpdateData.orderId);
});
