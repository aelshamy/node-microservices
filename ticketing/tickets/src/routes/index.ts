import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const ticketsListRouter = express.Router();

ticketsListRouter.get('/api/tickets', async (req: Request, res: Response) => {
  const ticket = await Ticket.find({
    orderId: undefined,
  });
  res.send(ticket);
});

export { ticketsListRouter };
