import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import { randomBytes } from 'crypto';
import express from 'express';

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (_, res) => {
  res.send(posts);
});

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  posts[id] = {
    id,
    title: req.body.title,
  };
  await axios.post('http://localhost:4005/events', {
    type: 'PostCreated',
    data: posts[id],
  });
  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('Received Event: ', req.body.type);
  res.send({});
});

app.listen(4000, () => {
  console.log('Listening on 4000');
});
