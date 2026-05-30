import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Home from './pages/Home'
import Jogos from './pages/Jogos'
import DetalheJogo from './pages/DetalheJogo'
import Carrinho from './pages/Carrinho'
import Historico from './pages/Historico'
import Relatorios from './pages/Relatorios'
import CadastroCrianca from './pages/CadastroCrianca'
import Planos from './pages/Planos'
import Dashboard from './pages/Dashboard'
import Jogar from './pages/Jogar'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro-crianca" element={
          <ProtectedRoute semOnboarding><CadastroCrianca /></ProtectedRoute>
        } />
        <Route path="/planos" element={
          <ProtectedRoute semOnboarding><Planos /></ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute><Home /></ProtectedRoute>
        } />
        <Route path="/jogos" element={
          <ProtectedRoute><Jogos /></ProtectedRoute>
        } />
        <Route path="/jogos/:id" element={
          <ProtectedRoute><DetalheJogo /></ProtectedRoute>
        } />
        <Route path="/jogar/:id" element={
          <ProtectedRoute><Jogar /></ProtectedRoute>
        } />
        <Route path="/carrinho" element={
          <ProtectedRoute><Carrinho /></ProtectedRoute>
        } />
        <Route path="/historico" element={
          <ProtectedRoute><Historico /></ProtectedRoute>
        } />
        <Route path="/relatorios" element={
          <ProtectedRoute><Relatorios /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
