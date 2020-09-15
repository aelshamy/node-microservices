import { errorHandler, NotFoundError } from '@ajmoro/common';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import morganBody from 'morgan-body';
import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';

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
    // secure: process.env.NODE_ENV !== 'test',
    secure: false,
  })
);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);
app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
