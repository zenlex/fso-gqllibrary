import { ALL_BOOKS } from '../queries';
import { useQuery } from '@apollo/client';

const Recommended = ({ show, favGenre }) => {
  console.log({ favGenre });
  const { data, loading } = useQuery(ALL_BOOKS, {
    variables: {
      genre: favGenre,
    },
  });

  if (!show) return null;

  if (loading) return <div>loading...</div>;

  if (!data) return <div>no data found...</div>;
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
