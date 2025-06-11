// Importing core modules and components
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Pages
import Landing from './Landing'
import SignUp from './SignUp'
import LoginPage from './LoginPage'
import HomePage from './HomePage'
import LessonPage from './LessonPage'

// Context Providers
import { SpeechProvider } from './Avatar'
import { AuthProvider } from './utils/AuthContext'

// UI Components
import NavigationBar from './components/NavigationBar'
import PrivateRoute from './PrivateRoute'
import { ToastProviderComponent } from './components/ui/use-toast'
import GoogleTranslate from './components/GoogleTranslate'
import CollapsibleReadAloudButton from './components/ReadAloudButton'

// Styles
import './App.css'

function App() {
  return (
    // AuthProvider provides authentication context to the entire app
    <AuthProvider>
      {/* ToastProviderComponent enables toast notifications globally */}
      <ToastProviderComponent>
        {/* Router provides routing functionality */}
        <Router>
          {/* SpeechProvider manages speech synthesis or avatar functionality */}
          <SpeechProvider>
            <div className="App">
              
              {/* Top navigation bar, visible on all routes */}
              <NavigationBar />

              {/* Define all application routes */}
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Private routes - only accessible when logged in */}
                <Route 
                  path="/home" 
                  element={<PrivateRoute><HomePage /></PrivateRoute>} 
                />
                <Route 
                  path="/lesson/:levelId" 
                  element={<PrivateRoute><LessonPage /></PrivateRoute>} 
                />
              </Routes>

              {/* Google Translate widget */}
              <GoogleTranslate />

              {/* Read aloud accessibility feature */}
              <CollapsibleReadAloudButton />
            </div>
          </SpeechProvider>
        </Router>
      </ToastProviderComponent>
    </AuthProvider>
  )
}

export default App