import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ME } from './queries';
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
  }, []);

  const { data } = useQuery(ME);
  useEffect(() => {
    if (data?.me) {
      console.log('Userdata inside LoginForm useEffect() : ', data);
      setFavGenre(data.me.favoriteGenre);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, token]);

  const logout = () => {
    client.resetStore();
    localStorage.clear();
    setToken(null);
    setFavGenre(null);
    setPage('authors');
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
      {token && (
        <Recommended show={page === 'recommended'} favGenre={favGenre} />
      )}
    </div>
  );
};

export default App;
