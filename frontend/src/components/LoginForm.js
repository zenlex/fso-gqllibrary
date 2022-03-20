import { useEffect, useState } from "react"
import { useMutation } from '@apollo/client'
import { LOGIN } from "../queries"

const LoginForm = ({setToken, setMsg,}) => {
const [username, setUsername] = useState('')
const [password, setPassword] = useState('')

const [ login, result ] = useMutation(LOGIN, {
  onError: (error) => {
    setMsg(error.message)
  }
})

useEffect(() => {
  if (result.data) {
    const token = result.data.login.value
    setToken(token)
    localStorage.setItem('library-user-token', token)
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [result.data])
const handleLogin = async (e) => {
  e.preventDefault()
  login({ variables: {username, password}})
}

  return (
    <div>
      <form onSubmit={handleLogin}>
        username:
        <input 
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        password:
        <input 
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <button type="submit">login</button>
        <button
          onClick={() => {
            setUsername('')
            setPassword('')
          }}
          type="button">cancel</button>
      </form>
    </div>
  )
}

export default LoginForm