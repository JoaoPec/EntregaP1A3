import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Jogos from './pages/Jogos'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/jogos" element={
          <ProtectedRoute><Jogos /></ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/jogos" replace />} />
        <Route path="*" element={<Navigate to="/jogos" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
