import { Navigate } from 'react-router-dom'
import { tokenValido } from '../services/api'

function ProtectedRoute({ children }) {
  if (!tokenValido()) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
