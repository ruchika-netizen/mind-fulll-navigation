import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthGuard = ({ children, requireAuth = true }) => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    // Agar URL mein verified=true hai toh humein kuch nahi dikhana
    const isVerified = searchParams.get("verified") === "true";

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const isAuth = !!session;

            // Strict Bypass for Verification and Reset Password
            if (isVerified || location.pathname === "/reset-password") {
                setLoading(false);
                return;
            }

            if (requireAuth && !isAuth) {
                navigate("/login", { replace: true });
            } else if (!requireAuth && isAuth) {
                navigate("/", { replace: true });
            }
            setLoading(false);
        };

        checkAuth();
    }, [requireAuth, navigate, location.pathname, isVerified]);

    // Jab tak loading ho ya verification chal rahi ho, screen blank rakho
    if (loading || isVerified) return null;

    return children;
};