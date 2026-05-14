import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { AuthGuard } from "./components/AuthGuard";
import EnsoLoader from "./components/EnsoLoader";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Rituals from "./pages/Rituals";
import Invitation from "./pages/Invitation";
import Breath from "./pages/Breath";
import NavigatorGuide from "./pages/NavigatorGuide";
import Navigator from "./pages/Navigator";
import River from "./pages/River";
import Milestones from "./pages/Milestones";
import Well from "./pages/Well";
import Orchard from "./pages/Orchard";
import RiverList from "./pages/RiverList";
import GatheringPlace from "./pages/Gatheringplace";
import Compass from "./pages/Compass";
import Settings from "./pages/Settings";
import Forge from "./pages/Forge";
import StillWater from "./pages/StillWater";
import WellbeingPractices from "./pages/WellbeingPractices";
import MarkMoment from "./pages/MarkMoment";
import CompanionReadings from "./pages/Compagionreading";
import ScrollToTop from "./components/ScrollToTop";
import Partners from "./pages/Partners";
import FinalWord from "./pages/FinalWord";
import "./index.css";
import Invitations from "./pages/Invitations";
import Navigators from "./pages/Navigators";
import PaymentSuccess from "./pages/PaymentSuccess";
import Paymentriver from "./pages/Paymentriver";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const [isAnimationLoading, setIsAnimationLoading] = useState(() => {
    const played = sessionStorage.getItem("enso_played");
    return played !== "true";
  });
  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isOnboarding = searchParams.get("mode") === "onboarding";
  const isAuthPage = ["/login", "/signup", "/forgot-password", "/reset-password"].includes(location.pathname);
  const specialPages = ["/invitation", "/breath", "/navigator", "/navigatorguide"];
  const shouldHideNav = isAuthPage || (specialPages.includes(location.pathname) && isOnboarding);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setCheckingAuth(false);
    };

    checkUser();

    // App.jsx ke useEffect ke andar bas itna rakhein
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setCheckingAuth(false);

      // SIGNED_OUT par force redirect ki zarurat nahi, 
      // AuthGuard khud hi user ko bhaga dega jab use session nahi milega.
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAnimationLoading || checkingAuth) {
    return <EnsoLoader onComplete={() => {
      sessionStorage.setItem("enso_played", "true");
      setIsAnimationLoading(false);
    }} />;
  }

  return (
    <div className="bg-[#F5F0E8] min-h-screen flex flex-col font-serif">
      <ScrollToTop />
      {session && !shouldHideNav && <Header />}

      <main className="flex-grow">
        <Routes location={location} key={location.pathname}>
          {/* --- PUBLIC ROUTES (Logged-in user yahan nahi aa sakta) --- */}
          <Route path="/login" element={<AuthGuard requireAuth={false}><Login /></AuthGuard>} />
          <Route path="/signup" element={<AuthGuard requireAuth={false}><Signup /></AuthGuard>} />
          <Route path="/forgot-password" element={<AuthGuard requireAuth={false}><ForgotPassword /></AuthGuard>} />
          <Route path="/reset-password" element={<AuthGuard requireAuth={false}><ResetPassword /></AuthGuard>} />

          {/* --- PRIVATE ROUTES (Bina login ke koi yahan nahi aa sakta) --- */}
          <Route path="/" element={<AuthGuard requireAuth={true}><Home /></AuthGuard>} />
          <Route path="/invitation" element={<AuthGuard requireAuth={true}><Invitation /></AuthGuard>} />
          <Route path="/breath" element={<AuthGuard requireAuth={true}><Breath /></AuthGuard>} />
          <Route path="/navigator" element={<AuthGuard requireAuth={true}><Navigator /></AuthGuard>} />
          <Route path="/navigatorguide" element={<AuthGuard requireAuth={true}><NavigatorGuide /></AuthGuard>} />
          <Route path="/rituals" element={<AuthGuard requireAuth={true}><Rituals /></AuthGuard>} />
          <Route path="/milestones" element={<AuthGuard requireAuth={true}><Milestones /></AuthGuard>} />
          <Route path="/river" element={<AuthGuard requireAuth={true}><River /></AuthGuard>} />
          <Route path="/well" element={<AuthGuard requireAuth={true}><Well /></AuthGuard>} />
          <Route path="/orchard" element={<AuthGuard requireAuth={true}><Orchard /></AuthGuard>} />
          <Route path="/river-list" element={<AuthGuard requireAuth={true}><RiverList /></AuthGuard>} />
          <Route path="/gathering-place" element={<AuthGuard requireAuth={true}><GatheringPlace /></AuthGuard>} />
          <Route path="/compass" element={<AuthGuard requireAuth={true}><Compass /></AuthGuard>} />
          <Route path="/settings" element={<AuthGuard requireAuth={true}><Settings /></AuthGuard>} />
          <Route path="/forge" element={<AuthGuard requireAuth={true}><Forge /></AuthGuard>} />
          <Route path="/still-water" element={<AuthGuard requireAuth={true}><StillWater /></AuthGuard>} />
          <Route path="/mark-moment" element={<AuthGuard requireAuth={true}><MarkMoment /></AuthGuard>} />
          <Route path="/milestones/edit/:id" element={<AuthGuard requireAuth={true}><MarkMoment /></AuthGuard>} />
          <Route path="/wellbeingpractices" element={<AuthGuard requireAuth={true}><WellbeingPractices /></AuthGuard>} />
          <Route path="/companionReadings" element={<AuthGuard requireAuth={true}><CompanionReadings /></AuthGuard>} />
          <Route path="/partners" element={<AuthGuard requireAuth={true}><Partners /></AuthGuard>} />
          <Route path="/finalword" element={<AuthGuard requireAuth={true}><FinalWord /></AuthGuard>} />
          <Route path="/invitations" element={<AuthGuard requireAuth={true}><Invitations /></AuthGuard>} />
          <Route path="/navigators" element={<AuthGuard requireAuth={true}><Navigators /></AuthGuard>} />
          <Route path="/paymentsuccess" element={<AuthGuard requireAuth={true}><PaymentSuccess /></AuthGuard>} />
          <Route path="/paymentriver" element={<AuthGuard requireAuth={true}><Paymentriver /></AuthGuard>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {session && !shouldHideNav && <Footer />}
    </div>
  );
}

export default App;