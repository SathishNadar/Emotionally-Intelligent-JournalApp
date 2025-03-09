import { Route, Routes, Link} from 'react-router-dom'
import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import Home from './pages/home.jsx'

function App() {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route path="Signup" element={<Signup/>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App