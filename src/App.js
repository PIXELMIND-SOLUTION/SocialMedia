import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import HomeScreen from './components/HomeScreen';
import Sidebar from './Views/Sidebar';
import Header from './Views/Header';
import Settings from './components/Settings'; // real component

function App() {
  const location = useLocation();

  // Only hide Sidebar and Header on login page
  const isLoginPage = location.pathname === "/";

  return (
    <div className="d-flex">
      {!isLoginPage && <Sidebar />}
      <div className="flex-grow-1 w-100">
        {!isLoginPage && <Header />}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
