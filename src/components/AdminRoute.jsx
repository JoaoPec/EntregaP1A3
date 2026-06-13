import { Navigate } from 'react-router-dom'
import { isAdmin } from '../services/auth'

// Protege rotas exclusivas do administrador
function AdminRoute({ children }) {
  const token = localStorage.getItem('cognify_token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin()) {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute
