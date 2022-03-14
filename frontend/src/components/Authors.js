import { useQuery } from '@apollo/client';
import { ALL_AUTHORS } from '../queries';

const Authors = (props) => {
  const { data, loading, error } = useQuery(ALL_AUTHORS);

  if (!props.show) {
    return null;
  }

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    return<div>{error.message}</div>
  }

  if (data) {
    const authors = data.allAuthors;
    console.log('authors: ', authors)
    return (
      <div>
        <h2>authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>born</th>
              <th>books</th>
            </tr>
            {authors.map((a) => (
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
};
export default Authors;
