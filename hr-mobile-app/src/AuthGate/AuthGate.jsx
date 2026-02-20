import { useState } from 'react'
import LoginPage from './LoginPage'
import App from '../App'

function AuthGate() {

  const [user, setUser] = useState(null)

  function handleLogin(userData) {
    setUser(userData)
  }

  function handleLogout() {
    setUser(null)
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <App
      employeeData={user}
      onLogout={handleLogout}
    />
  )
}

export default AuthGate
