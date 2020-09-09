import Link from 'next/link';
import Router from 'next/router';
import { useState } from 'react';
import useRequest from '../../hooks/use-request';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
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
      <h1>Sign Up</h1>
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
      <button className="btn btn-primary">Sign Up</button>
      <span style={{ margin: '0 10px' }}>if you have an account</span>
      <Link href="/auth/signin">
        <a>Sign In</a>
      </Link>
    </form>
  );
};

export default Signup;
