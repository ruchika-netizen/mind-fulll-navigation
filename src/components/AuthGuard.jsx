import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useLocation } from "react-router-dom"; // location ke liye useLocation add kiya
import EnsoLoader from "./EnsoLoader";

export const AuthGuard = ({ children, requireAuth = true }) => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation(); // location object yahan se milega

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const isAuth = !!session;

            if (requireAuth && !isAuth) {
                // Agar authentication zaroori hai aur session nahi hai -> Login bhejo
                navigate("/login", { replace: true });
            }
            else if (!requireAuth && isAuth) {
                // Agar user logged in hai aur login/signup page par hai
                // Lekin humein reset-password page par redirect nahi karna hai
                if (location.pathname !== "/reset-password") {
                    navigate("/", { replace: true });
                }
            }
            setLoading(false);
        };

        checkAuth();

        // Auth changes monitor karein (Logout ke liye)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_OUT" && requireAuth) {
                navigate("/login", { replace: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [requireAuth, navigate, location.pathname]); // location.pathname dependency add ki taaki ye trigger ho sake

    if (loading) return <EnsoLoader />;

    return children;
};