import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './app/store'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import PhishingAttemptsPage from './pages/PhishingAttemptsPage'
import CreatePhishingAttemptPage from './pages/CreatePhishingAttemptPage'
import PhishingAttemptDetailPage from './pages/PhishingAttemptDetailPage'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/login" replace />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="phishing" element={<PhishingAttemptsPage />} />
            <Route path="phishing/new" element={<CreatePhishingAttemptPage />} />
            <Route path="phishing/:id" element={<PhishingAttemptDetailPage />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
