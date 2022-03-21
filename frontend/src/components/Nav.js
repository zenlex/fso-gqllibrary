import LoginForm from './LoginForm';

const Nav = ({ token, setToken, setPage, notify, logout }) => {
  return (
    <nav>
      <button onClick={() => setPage('authors')}>authors</button>
      <button onClick={() => setPage('books')}>books</button>
      {token && <button onClick={() => setPage('add')}>add book</button>}
      <LoginForm
        setToken={setToken}
        setMsg={notify}
        logout={logout}
        token={token}
      />
    </nav>
  );
};

export default Nav;
