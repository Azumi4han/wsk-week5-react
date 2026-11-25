import {useNavigate} from 'react-router';
import {useState} from 'react';
import useForm from '../hooks/formHooks';
import {useAuthentication} from '../hooks/apiHooks';

const initValues = {
  username: '',
  password: '',
};

const LoginForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const {postLogin} = useAuthentication();

  const doLogin = async () => {
    try {
      const loginResult = await postLogin(inputs);
      localStorage.setItem('token', loginResult.token);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const {inputs, handleInputChange, handleSubmit} = useForm(
    doLogin,
    initValues,
  );

  return (
    <>
      <h3>Login</h3>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="loginuser">Username</label>
          <input
            name="username"
            type="text"
            id="loginuser"
            onChange={handleInputChange}
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label htmlFor="loginpassword">Password</label>
          <input
            name="password"
            type="password"
            id="loginpassword"
            onChange={handleInputChange}
            autoComplete="current-password"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default LoginForm;
