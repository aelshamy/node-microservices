import { errorHandler, NotFoundError, userExists } from '@ajmoro/common';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express, { Response } from 'express';
import 'express-async-errors';
import morganBody from 'morgan-body';

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

app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
