import { useEffect, useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Recommended from './components/Recommended';
import Notify from './components/Notify';
import Nav from './components/Nav';

const App = ({ client }) => {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null);
  const [favGenre, setFavGenre] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('library-user-token');
    if (storedToken) {
      setToken(storedToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div>
      <Nav
        token={token}
        setToken={setToken}
        setPage={setPage}
        notify={notify}
        logout={logout}
        setFavGenre={setFavGenre}
      />
      <Notify errorMessage={notification} />
      <Authors show={page === 'authors'} token={token} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} />
      <Recommended show={page === 'recommended'} favGenre={favGenre} />
    </div>
  );
};

export default App;
