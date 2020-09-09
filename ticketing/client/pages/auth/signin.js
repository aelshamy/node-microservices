import Link from 'next/link';
import Router from 'next/router';
import { useState } from 'react';
import useRequest from '../../hooks/use-request';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'POST',
    data: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  });
  const onSubmit = (e) => {
    e.preventDefault();

    doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign In</h1>
      <div className="form-group">
        <label>Email address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        ></input>
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
        ></input>
      </div>
      {errors}
      <button className="btn btn-primary">Sign In</button>
      <span style={{ margin: '0 10px' }}>if you do not have an account</span>
      <Link href="/auth/signup">
        <a>Sign Up</a>
      </Link>
    </form>
  );
};

export default SignIn;
