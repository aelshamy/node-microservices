import axios from 'axios';

const getClient = ({ req }) => {
  if (typeof Window === 'undefined') {
    return axios.create({
      baseURL: 'http://www.ticketingwithnode.xyz',
      headers: req.headers,
    });
  }
  return axios.create({
    baseURL: '/',
  });
};

export default getClient;
