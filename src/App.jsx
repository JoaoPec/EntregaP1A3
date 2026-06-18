import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import ClientRoute from './components/ClientRoute'
import Login from './pages/Login'
import Home from './pages/Home'
import Jogos from './pages/Jogos'
import DetalheJogo from './pages/DetalheJogo'
import Carrinho from './pages/Carrinho'
import Historico from './pages/Historico'
import Relatorios from './pages/Relatorios'
import Admin from './pages/Admin'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/jogos" element={<ProtectedRoute><Jogos /></ProtectedRoute>} />
        <Route path="/jogos/:id" element={<ProtectedRoute><DetalheJogo /></ProtectedRoute>} />
        <Route path="/carrinho" element={<ClientRoute><Carrinho /></ClientRoute>} />
        <Route path="/historico" element={<ClientRoute><Historico /></ClientRoute>} />
        <Route path="/relatorios" element={<AdminRoute><Relatorios /></AdminRoute>} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
