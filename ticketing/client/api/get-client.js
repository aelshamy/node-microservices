import axios from 'axios';

const getClient = ({ req }) => {
  if (typeof Window === 'undefined') {
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  }
  return axios.create({
    baseURL: '/',
  });
};

export default getClient;
