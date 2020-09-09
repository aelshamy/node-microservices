import { errorHandler, NotFoundError } from '@ajmoro/common';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import morganBody from 'morgan-body';

const app = express();
//because we are behind nginx proxy
app.set('trust proxy', true);

app.use(json());
// app.use(morgan('dev'));
morganBody(app, {
  filterParameters: ['password'],
});
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
