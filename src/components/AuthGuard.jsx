import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthGuard = ({ children, requireAuth = true }) => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const isAuth = !!session;

            if (requireAuth && !isAuth) {
                navigate("/login", { replace: true });
            } else if (!requireAuth && isAuth && location.pathname !== "/reset-password") {
                navigate("/", { replace: true });
            }
            setLoading(false);
        };
        checkAuth();
    }, [requireAuth, navigate, location.pathname]);

    if (loading) return null; // Simple null taaki glitch na dikhe

    return children;
};