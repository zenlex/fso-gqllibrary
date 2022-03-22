import { useEffect, useState } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import { ME } from './queries';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Recommended from './components/Recommended';
import Notify from './components/Notify';
import Nav from './components/Nav';

const App = () => {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null);
  const [favGenre, setFavGenre] = useState('');
  const [notification, setNotification] = useState(null);

  // check on reload for current token
  useEffect(() => {
    const storedToken = localStorage.getItem('library-user-token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  //get info for current user
  const { data } = useQuery(ME, {
    variables: { token },
  });

  useEffect(() => {
    if (data?.me) {
      setFavGenre(data.me.favoriteGenre);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, token]);

  const client = useApolloClient();

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
      />
      <Notify errorMessage={notification} />
      <Authors show={page === 'authors'} token={token} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} setPage={setPage} />
      <Recommended show={page === 'recommended'} favGenre={favGenre} />
    </div>
  );
};

export default App;
