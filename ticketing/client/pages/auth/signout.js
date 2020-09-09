import Router from 'next/router';
import { useEffect } from 'react';
import useRequest from '../../hooks/use-request';

const SignOut = () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'POST',
    body: {},
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Sign you out...</div>;
};

export default SignOut;
