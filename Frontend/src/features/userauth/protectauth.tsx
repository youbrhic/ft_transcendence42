import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const store = useStore();

  useEffect(() => {
    const check = async () => {
      try {
        const response = (await fetch(
          `${import.meta.env.VITE_API_URL}/api/hello`,
          {
            credentials: "include",
          }
        ).then((res) => res.json())) as {
          refreshtoken: boolean;
          accesstoken: boolean;
        };
        if (!response.accesstoken) {
          const res = (await fetch(
            `${import.meta.env.VITE_API_URL}/api/login/refreshtoken`,
            {
              credentials: "include",
            }
          ).then((e) => e.json())) as { refreshtoken: boolean };
          if (!res.refreshtoken) {
            await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
              credentials: "include",
            });
            navigate("/login/Signin");
            return;
          }
        }
        if (!store.hasFetchedUser) await store.fetchUserInfo();
        setIsAuthenticated(true);
      } catch (err) {
        await fetch("http://e3r11p8.1337.ma:3000/logout");
        navigate("/login/Signin");
      }
    };
    check();
  }, [navigate]);
  return isAuthenticated ? <>{children}</> : null;
}
