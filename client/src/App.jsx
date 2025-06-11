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

// Games Components
import GamesDashboard from './components/games/GamesDashboard'
import DrawingCanvas from './components/games/Canvas'
import FlippedCard from './components/games/FlippedCard'
import FillInTheBlanks from './components/games/FillInTheBlanks'
import Frog from './components/games/Frog'
import Game from './components/games/Match'
import GuessTheEmoji from './components/games/Noun'
import RangoliGame from './components/games/Rangoli'
import Sentence from './components/games/Sentence'

// Stories Components
import GolcondaFortStory from './components/stories/GolcondaFort'
import CharminarStory from './components/stories/Charminar'
import MahaKumbh from './components/stories/MahaKumbh'
import Cleanliness from './components/stories/Cleanliness'
import StoryDashboard from './components/stories/StoryDashboard'

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

                {/* Games routes */}
                <Route path="/games" element={<PrivateRoute><GamesDashboard /> </PrivateRoute>} />
                <Route path="/flippedcard" element={<PrivateRoute> <FlippedCard /></PrivateRoute>} />
                <Route path="/fillintheblanks" element={<PrivateRoute><FillInTheBlanks /> </PrivateRoute>} />
                <Route path="/frog" element={<PrivateRoute><Frog /> </PrivateRoute>} />
                <Route path="/match" element={<PrivateRoute> <Game /></PrivateRoute>} />
                <Route path="/canvas" element={<PrivateRoute><DrawingCanvas /></PrivateRoute>} />
                <Route path="/sentence" element={<PrivateRoute><Sentence /> </PrivateRoute>} />
                <Route path="/noun" element={<PrivateRoute><GuessTheEmoji /> </PrivateRoute>} />
                <Route path="/rangoli" element={<PrivateRoute><RangoliGame /> </PrivateRoute>} />

                {/* Stories routes */}
                <Route path="/stories" element={<PrivateRoute><StoryDashboard /> </PrivateRoute>} />
                <Route path="/golconda" element={<PrivateRoute><GolcondaFortStory /></PrivateRoute>} />
                <Route path="/cleanliness" element={<PrivateRoute><Cleanliness /></PrivateRoute>} />
                <Route path="/mahakumbh" element={<PrivateRoute><MahaKumbh /></PrivateRoute>} />
                <Route path="/charminar" element={<PrivateRoute><CharminarStory /></PrivateRoute>} />

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