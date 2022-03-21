import LoginForm from './LoginForm';

const Nav = ({ token, setToken, setPage, notify, logout, setFavGenre }) => {
  return (
    <nav>
      <button onClick={() => setPage('authors')}>authors</button>
      <button onClick={() => setPage('books')}>books</button>
      {token && <button onClick={() => setPage('add')}>add book</button>}
      {token && (
        <button onClick={() => setPage('recommended')}>recommend</button>
      )}
      <LoginForm
        setToken={setToken}
        setMsg={notify}
        logout={logout}
        token={token}
        setFavGenre={setFavGenre}
      />
    </nav>
  );
};

export default Nav;
