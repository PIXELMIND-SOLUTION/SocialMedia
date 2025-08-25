import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import HomeScreen from './components/HomeScreen';
import Sidebar from './Views/Sidebar';
import Header from './Views/Header';
import Settings from './Settings/Settings'; // real component
import MyProfile from './profiles/Myprofile';
import UserProfile from './profiles/Usersprofile';
import MessageModel from './messages/MessageModal';
import CreatePost from './CreatePost/CreatePost';
import WatchTogether from './WatchTogether/WatchTogether';

function App() {
  const location = useLocation();

  // Only hide Sidebar and Header on login page
  const isLoginPage = location.pathname === "/";

  return (
    <div className="d-flex">
      {!isLoginPage && (
        <div className="vh-100 position-sticky top-0" style={{ zIndex: 1000 }}>
          <Sidebar />
        </div>
      )}
      <div className="flex-grow-1 w-100">
        {!isLoginPage && <Header />}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/messages" element={<MessageModel />} />
          <Route path='/create' element={<CreatePost/>}/>
          <Route path='/watch' element={<WatchTogether/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;