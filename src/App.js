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
import CampaignFlowApp from './CampaignManagement/CampaignManagement';
import CampaignMenu from './CampaignManagement/CampaignMenu';
import SimplifiedForm from './CampaignManagement/SimplifiedForm';
import PricingPlans from './CampaignManagement/PricingPlan';
import FormDashboard from './CampaignManagement/ResponseForm';
import CampaignAdModal from './CampaignManagement/CurrentCampaignAd';
import WalletModal from './Wallet/MyWallet';
import PackageSelectionModal from './Wallet/WalletPackages';
import Notifications from './notifications/Notification';
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
          <Route path="/campaign" element={<CampaignMenu />} />
          <Route path='/simplifiedform' element={<SimplifiedForm/>}/>
          <Route path='/pricingplan' element={<PricingPlans/>} />
          <Route path='/responseform' element={<FormDashboard/>}/>
          <Route path='/campaign-ad' element={<CampaignAdModal/>}/>
          <Route path="/mywallet" element={<WalletModal />} />
          <Route path="/packages" element={<PackageSelectionModal />} />
          <Route path='/notification' element={<Notifications/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;