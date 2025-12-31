import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import HomeScreen from "./components/HomeScreen";
import Sidebar from "./Views/Sidebar";
import Header from "./Views/Header";
import Settings from "./Settings/Settings";
import MyProfile from "./profiles/Myprofile";
import UserProfile from "./profiles/Usersprofile";
import MessageModel from "./messages/MessageModal";
import CreatePost from "./CreatePost/CreatePost";
import WatchTogether from "./WatchTogether/WatchTogether";
import CampaignFlowApp from "./CampaignManagement/CampaignManagement";
import CampaignMenu from "./CampaignManagement/CampaignMenu";
import SimplifiedForm from "./CampaignManagement/SimplifiedForm";
import PricingPlans from "./CampaignManagement/PricingPlan";
import FormDashboard from "./CampaignManagement/ResponseForm";
import CampaignAdModal from "./CampaignManagement/CurrentCampaignAd";
import WalletModal from "./Wallet/MyWallet";
import WalletPackages from "./Wallet/WalletPackages";
import Notifications from "./notifications/Notification";
import PrivateRoute from "./components/PrivateRoute";
import Room from "./WatchTogether/Room";
import Spin from "./Spin/Spin";
import CountdownTimer from "./CountDown";

function App() {
  const location = useLocation();

  // Only hide Sidebar and Header on login page
  const isLoginPage = location.pathname === "/";
  const watch = location.pathname.startsWith("/watch/");
  const countdownEndTime = new Date("2026-01-01T00:00:00").getTime();

  const shouldShowCountdown =
  location.pathname === "/" && Date.now() < countdownEndTime;





  return (
    <>
    {/* ✅ SHOW COUNTDOWN ONLY ON LOGIN PAGE */}
      {shouldShowCountdown && (
  <div
    style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: 2000
    }}
  >
    <CountdownTimer />
  </div>
)}


    <div className="d-flex">
      {!isLoginPage && (
        <div className="vh-100 position-sticky top-0" style={{ zIndex: 1000 }}>
          {!isLoginPage && !watch && <Sidebar />}
        </div>
      )}
      <div className="flex-grow-1 w-100">
        {!isLoginPage && !watch && <Header />}
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <HomeScreen />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route
            path="/spin"
            element={
              <PrivateRoute>
                <Spin />
              </PrivateRoute>
            }
          />
          <Route
            path="/myprofile"
            element={
              <PrivateRoute>
                <MyProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/userprofile/:id"
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <PrivateRoute>
                <MessageModel />
              </PrivateRoute>
            }
          />
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }
          />
          <Route
            path="/watch"
            element={
              <PrivateRoute>
                <WatchTogether />
              </PrivateRoute>
            }
          />
          <Route
            path="/watch/:roomId"
            element={
              <PrivateRoute>
                <Room />
              </PrivateRoute>
            }
          />
          <Route
            path="/campaign"
            element={
              <PrivateRoute>
                <CampaignMenu />
              </PrivateRoute>
            }
          />
          <Route
            path="/simplifiedform"
            element={
              <PrivateRoute>
                <SimplifiedForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/pricingplan"
            element={
              <PrivateRoute>
                <PricingPlans />
              </PrivateRoute>
            }
          />
          <Route
            path="/responseform"
            element={
              <PrivateRoute>
                <FormDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/campaign-ad"
            element={
              <PrivateRoute>
                <CampaignAdModal />
              </PrivateRoute>
            }
          />
          <Route
            path="/mywallet"
            element={
              <PrivateRoute>
                <WalletModal />
              </PrivateRoute>
            }
          />
          <Route
            path="/packages"
            element={
              <PrivateRoute>
                <WalletPackages />
              </PrivateRoute>
            }
          />
          <Route
            path="/notification"
            element={
              <PrivateRoute>
                <Notifications />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
    </>
  );
}

export default App;
