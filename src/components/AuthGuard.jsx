import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useLocation } from "react-router-dom"; // location ke liye useLocation add kiya
import EnsoLoader from "./EnsoLoader";

export const AuthGuard = ({ children, requireAuth = true }) => {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const getInitialSession = async () => {
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            setSession(currentSession);

            const isAuth = !!currentSession;

            if (requireAuth && !isAuth) {
                // Agar home page link dala aur login nahi hai, toh login pe bhejo
                navigate("/login", { replace: true, state: { from: location } });
            }
            else if (!requireAuth && isAuth && location.pathname !== "/reset-password") {
                // Agar logged in hai aur signup/login khola, toh home pe bhejo
                navigate("/", { replace: true });
            }
            setLoading(false);
        };

        getInitialSession();
    }, [requireAuth, navigate, location.pathname]);

    // Glitch se bachne ke liye: Jab tak checking ho rahi hai, kuch mat dikhao
    if (loading) return <EnsoLoader />;

    return children;
};