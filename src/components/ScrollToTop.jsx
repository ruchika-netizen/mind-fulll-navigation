import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Method 1: Standard (Slightly more forceful)
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant", // "smooth" ki jagah instant use karein transition check karne ke liye
      });
    } catch (error) {
      window.scrollTo(0, 0);
    }

    // Method 2: Fallback (Agar UI heavy hai toh ye kaam karega)
    const body = document.querySelector("body");
    if (body) body.scrollTo(0, 0);

  }, [pathname]);

  return null;
};

export default ScrollToTop;