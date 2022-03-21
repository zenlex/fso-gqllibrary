import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries';

const EditAuthor = ({ authors }) => {
  const [editAuthor] = useMutation(EDIT_AUTHOR);
  const [authBirthYear, setAuthBirthYear] = useState('');
  const [authName, setAuthName] = useState('');

  const submitBirthYear = (e) => {
    e.preventDefault();
    console.log(`setting year for ${authName} to ${authBirthYear}`);
    editAuthor({
      variables: {
        name: authName === '' ? null : authName,
        setBornTo: parseInt(authBirthYear),
      },
      refetchQueries: [{ query: ALL_AUTHORS }],
    });
  };

  return (
    <div>
      <h2>set author birth year</h2>
      <form onSubmit={submitBirthYear}>
        <select
          value={authName}
          onChange={({ target }) => setAuthName(target.value)}
        >
          {authors.map((a) => {
            return (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            );
          })}
        </select>
        born:{' '}
        <input
          value={authBirthYear}
          onChange={({ target }) => setAuthBirthYear(target.value)}
        />
        <button type='submit'>set it</button>
      </form>
    </div>
  );
};

export default EditAuthor;
