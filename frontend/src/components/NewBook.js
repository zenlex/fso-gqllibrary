import { useState } from 'react';
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS } from '../queries';
import { useMutation } from '@apollo/client';
const NewBook = ({ show, setPage }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const [createBook, result] = useMutation(ADD_BOOK);

  if (!show) {
    return null;
  }

  if (result.error) {
    return <div>{result.error.message}</div>;
  }

  const submit = async (event) => {
    event.preventDefault();
    const submittedGenres = genre === '' ? genres : genres.concat(genre);
    createBook({
      variables: {
        title: title === '' ? null : title,
        author: author === '' ? null : author,
        published: parseInt(published),
        genres: submittedGenres,
      },
      refetchQueries: [ALL_AUTHORS, ALL_BOOKS],
    });

    setTitle('');
    setPublished('');
    setAuthor('');
    setGenres([]);
    setGenre('');
    setPage('books');
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre('');
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type='button'>
            add genre
          </button>
        </div>
        <div>genres: {genres.join(', ')}</div>
        <button type='submit'>create book</button>
      </form>
    </div>
  );
};

export default NewBook;
