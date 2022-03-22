import { ALL_BOOKS } from '../queries';
import { useQuery } from '@apollo/client';

// View to display list of books based on logged in users genre
const Recommended = ({ show, favGenre }) => {
  // fetch books filtered by genre
  const { data, loading, error } = useQuery(ALL_BOOKS, {
    variables: {
      genre: favGenre,
    },
  });

  // not active view
  if (!show) return null;

  // graphQl query pending
  if (loading) return <div>loading...</div>;

  // error handling
  if (error) return <div>{error.message}</div>;

  //fetch successful
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
            <th>genres</th>
          </tr>
          {data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
              <td>{a.genres.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommended;
