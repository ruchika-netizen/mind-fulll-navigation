import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(undefined);
  const location = useLocation();

  useEffect(() => {

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });


    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);


  if (session === undefined) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center italic opacity-40 text-sm font-serif">
        Validating flow...
      </div>
    );
  }


  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;