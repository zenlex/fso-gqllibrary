import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../queries';

const LoginForm = ({ setToken, setMsg, logout, token }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setMsg(error.message);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem('library-user-token', token);
      setVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.data]);

  const handleLogin = async (e) => {
    e.preventDefault();
    await login({ variables: { username, password } });
    if (result.data) {
      setToken(result.data.login.value);
      setVisible(false);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    setVisible(false);
    logout();
  };

  if (!visible && !token) {
    return <button onClick={(e) => setVisible(!visible)}>login</button>;
  }

  if (token) {
    return <button onClick={handleLogout}>logout</button>;
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        username:
        <input
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        password:
        <input
          type='password'
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <button type='submit'>login</button>
        <button
          onClick={() => {
            setUsername('');
            setPassword('');
            setVisible(false);
          }}
          type='button'
        >
          cancel
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
