import SignIn from './auth/signin';

const Homepage = ({ currentUser }) => {
  return currentUser ? (
    <h1 className="text-center">Welcome To Ticketing with Node</h1>
  ) : (
    <SignIn />
  );
};

export default Homepage;
