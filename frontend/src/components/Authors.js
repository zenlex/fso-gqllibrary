import { useQuery, useMutation } from '@apollo/client';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';
import { useState } from 'react'

const Authors = (props) => {
  const { data, loading, error } = useQuery(ALL_AUTHORS);
  const [ editAuthor ] = useMutation(EDIT_AUTHOR)
  const [authBirthYear, setAuthBirthYear] = useState('')
  const [authName, setAuthName] = useState('')

  if (!props.show) {
    return null;
  }

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    return<div>{error.message}</div>
  }

  const submitBirthYear = (e) => {
    e.preventDefault()
    console.log(`setting year for ${authName} to ${authBirthYear}`)
    editAuthor({
      variables:{
        name: authName === '' ? null : authName,
        setBornTo: parseInt(authBirthYear)
      },
      refetchQueries: [{query:ALL_AUTHORS}]
    })
  }


  if (data) {
    const authors = data.allAuthors;
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
        <div>
          <h2>set author birth year</h2>
          <form onSubmit={submitBirthYear}>
            name: <input 
              value={authName} 
              onChange={({target}) => setAuthName(target.value)}/>
            born: <input 
              value={authBirthYear} 
              onChange ={({target}) => setAuthBirthYear(target.value)} />
          <button type="submit">set it</button>
          </form>
        </div>
      </div>
    );
  }
};
export default Authors;
