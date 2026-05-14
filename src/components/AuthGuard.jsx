import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import EnsoLoader from "./EnsoLoader";

export const AuthGuard = ({ children, requireAuth = true }) => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Session check karne ka function
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const isAuth = !!session;
            setAuthenticated(isAuth);

            if (requireAuth && !isAuth) {
                // Agar page login mangta hai par session nahi hai -> Go to Login
                navigate("/login", { replace: true });
            } else if (!requireAuth && isAuth) {
                // Agar login/signup page hai par user already login hai -> Go to Home
                navigate("/", { replace: true });
            }
            setLoading(false);
        };

        checkAuth();

        // Listen for auth changes (Logout detect karne ke liye)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_OUT" && requireAuth) {
                navigate("/login", { replace: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [requireAuth, navigate]);

    if (loading) return <EnsoLoader />;

    return children;
};