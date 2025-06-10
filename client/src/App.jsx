// import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Landing from './Landing'
import SignUp from './SignUp'
import LoginPage from './LoginPage'
import HomePage from './HomePage'
import { SpeechProvider } from './Avatar'
import LessonPage from './LessonPage';
import './App.css'
import { AuthProvider } from './utils/AuthContext'
import NavigationBar from './components/NavigationBar'
import PrivateRoute from './PrivateRoute'
import { ToastProviderComponent } from './components/ui/use-toast'
import GoogleTranslate from './components/GoogleTranslate';
import CollapsibleReadAloudButton from './components/ReadAloudButton'

function App() {
  return (
    <AuthProvider>
      <ToastProviderComponent>
        <Router>
          <SpeechProvider>
          <div className='App'>
            <NavigationBar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<LoginPage />} />

              {/* protected routes (requires logged in) */}
              <Route path="/home" element={<PrivateRoute><HomePage /> </PrivateRoute>} />
              <Route path="/lesson/:levelId" element={<PrivateRoute> <LessonPage /></PrivateRoute>} />

            </Routes>
            <GoogleTranslate/>
            <CollapsibleReadAloudButton/>
          </div>
          </SpeechProvider>
        </Router>
      </ToastProviderComponent>
    </AuthProvider>
  )
}

export default App



