import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { supabase } from "./supabaseClient";
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
// import Breaths from "./pages/Breaths";
import Navigators from "./pages/Navigators";
import PaymentSuccess from "./pages/PaymentSuccess";


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
  const isVerified = searchParams.get("verified") === "true";
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);
  const specialPages = ["/invitation", "/breath", "/navigator", "/navigatorguide"];
  const shouldHideNav = isAuthPage || (specialPages.includes(location.pathname) && isOnboarding);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setCheckingAuth(false);
    };
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setCheckingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAnimationComplete = () => {
    sessionStorage.setItem("enso_played", "true");
    setIsAnimationLoading(false);
  };

  if (isAnimationLoading || checkingAuth) {
    return <EnsoLoader onComplete={handleAnimationComplete} />;
  }

  return (
    <div className="bg-[#F5F0E8] min-h-screen flex flex-col font-serif">
      <ScrollToTop />
      {session && !shouldHideNav && <Header />}

      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={!session ? <Signup /> : <Navigate to="/" />} />

          {/* Root Logic Update */}
          <Route
            path="/"
            element={
              session ? (

                isVerified ? <Navigate to="/invitation?mode=onboarding" replace /> : <Home />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route path="/invitation" element={session ? <Invitation /> : <Navigate to="/login" />} />
          <Route path="/breath" element={session ? <Breath /> : <Navigate to="/login" />} />
          <Route path="/navigator" element={session ? <Navigator /> : <Navigate to="/login" />} />
          <Route path="/navigatorguide" element={session ? <NavigatorGuide /> : <Navigate to="/login" />} />
          <Route path="/rituals" element={session ? <Rituals /> : <Navigate to="/login" />} />
          <Route path="/milestones" element={session ? <Milestones /> : <Navigate to="/login" />} />
          <Route path="/river" element={session ? <River /> : <Navigate to="/login" />} />
          <Route path="/well" element={session ? <Well /> : <Navigate to="/login" />} />
          <Route path="/orchard" element={session ? <Orchard /> : <Navigate to="/login" />} />
          <Route path="/river-list" element={session ? <RiverList /> : <Navigate to="/login" />} />
          <Route path="/gathering-place" element={session ? <GatheringPlace /> : <Navigate to="/login" />} />
          <Route path="/compass" element={session ? <Compass /> : <Navigate to="/login" />} />
          <Route path="/settings" element={session ? <Settings /> : <Navigate to="/login" />} />
          <Route path="/forge" element={session ? <Forge /> : <Navigate to="/login" />} />
          <Route path="/still-water" element={session ? <StillWater /> : <Navigate to="/login" />} />
          <Route path="/mark-moment" element={session ? <MarkMoment /> : <Navigate to="/login" />} />
          <Route path="/milestones/edit/:id" element={<MarkMoment />} />
          <Route path="/wellbeingpractices" element={session ? <WellbeingPractices /> : <Navigate to="/login" />} />
          <Route path="/companionReadings" element={session ? <CompanionReadings /> : <Navigate to="/login" />} />
          <Route path="/partners" element={session ? <Partners /> : <Navigate to="/login" />} />
          <Route path="/finalword" element={session ? <FinalWord /> : <Navigate to="/login" />} />
          <Route path="/invitations" element={session ? <Invitations /> : <Navigate to="/login" />} />
          {/* <Route path="/breaths" element={session ? <Breaths /> : <Navigate to="/login" />} /> */}
          <Route path="/navigators" element={session ? <Navigators /> : <Navigate to="/login" />} />
          <Route path="/paymentsuccess" element={session ? <PaymentSuccess /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {session && !shouldHideNav && <Footer />}
    </div>
  );
}

export default App;