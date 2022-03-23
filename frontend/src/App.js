import { useEffect, useState } from 'react';
import { useQuery, useApolloClient, useSubscription } from '@apollo/client';
import { BOOK_ADDED, ME } from './queries';
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

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log('onSubscriptionData called');
      const addedBook = subscriptionData.data.bookAdded;
      notify(`New Book Added: ${addedBook.title} by ${addedBook.author.name}`);
      //! this part is currently broken due to a bug in apollo client - I had to rollback to a previous version to get the subscription hook to work correctly, but cache.updateQuery doesn't exist in 3.2....
      // client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
      //   return { allBooks: allBooks.concat(addedBook) };
      // });
    },
  });

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
