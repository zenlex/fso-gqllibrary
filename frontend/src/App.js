import { useEffect, useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Notify from './components/Notify';
import Nav from './components/Nav';

const App = ({ client }) => {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null);
  const [notification, setNotification] = useState(null);
  useEffect(() => {
    const storedToken = localStorage.getItem('library-user-token');
    if (storedToken) {
      setToken(storedToken);
    }
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
      />
      <Notify errorMessage={notification} />
      <Authors show={page === 'authors'} token={token} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} />
    </div>
  );
};

export default App;
