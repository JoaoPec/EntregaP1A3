import { Navigate } from 'react-router-dom'
import { tokenValido } from '../services/api'
import { isAdmin } from '../services/auth'

function ClientRoute({ children }) {
  if (!tokenValido()) {
    return <Navigate to="/login" replace />
  }

  if (isAdmin()) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ClientRoute
