import { errorHandler, NotFoundError, userExists } from '@ajmoro/common';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express, { Response } from 'express';
import 'express-async-errors';
import morganBody from 'morgan-body';
import { ticketsListRouter } from './routes';
import { creatTicketRouter } from './routes/new';
import { getTicketRouter } from './routes/show';
import { updateTicketRouter } from './routes/update';

const app = express();
//because we are behind nginx proxy
app.set('trust proxy', true);

app.use(json());
// app.use(morgan('dev'));
morganBody(app, {
  filterParameters: ['password'],
  skip: (req: Request, res: Response) => process.env.NODE_ENV === 'test',
});
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(userExists);
app.use(creatTicketRouter);
app.use(getTicketRouter);
app.use(ticketsListRouter);
app.use(updateTicketRouter);

app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
