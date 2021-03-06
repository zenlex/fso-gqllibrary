import { ALL_BOOKS } from '../queries';
import { useQuery } from '@apollo/client';
import { useState } from 'react';

const Books = ({ show, notify }) => {
  const [genre, setGenre] = useState('');
  const { data, loading, error } = useQuery(ALL_BOOKS, {
    variables: { genre },
  });

  if (!show) {
    return null;
  }

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const allGenres = new Set();
  data.allBooks.forEach(({ genres }) => {
    if (genres.length > 0) {
      genres.forEach((genre) => allGenres.add(genre));
    }
  });

  const books = data.allBooks;

  return (
    <div>
      <h2>books</h2>
      <div>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {books.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        {Array.from(allGenres).map((genre) => {
          return (
            <button key={genre} onClick={() => setGenre(genre)}>
              {genre}
            </button>
          );
        })}
        <button onClick={() => setGenre('')}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
