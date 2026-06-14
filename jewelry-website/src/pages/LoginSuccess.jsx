import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function LoginSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      // Fetch user profile and store it (same as regular login)
      axios
        .get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        })
        .catch(() => {
          // Profile fetch failed — not critical, continue anyway
        })
        .finally(() => {
          // Redirect back to checkout or home
          const redirect = sessionStorage.getItem("redirectAfterLogin") || "/";
          sessionStorage.removeItem("redirectAfterLogin");
          navigate(redirect);
        });
    } else {
      navigate("/login");
    }
  }, [params, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400 text-sm tracking-widest uppercase animate-pulse">
        Signing you in…
      </p>
    </div>
  );
}
