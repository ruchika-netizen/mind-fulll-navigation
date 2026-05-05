import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(undefined); // undefined means "checking"
  const location = useLocation();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Jab tak check ho raha hai, blank ya chota loader dikhao
  if (session === undefined) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center italic opacity-40 text-sm font-serif">
        Validating flow...
      </div>
    );
  }

  // Agar session nahi hai, to login bhej do
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;