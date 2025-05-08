import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store";

const NonAuth = () => {
  const { user } = useAuthStore();
  const { search } = useLocation();
  if (user !== null) {
    console.log(search);
    const returnTo = new URLSearchParams(search).get("returnTo") || "/";
    return <Navigate to={returnTo} replace={true} />;
  }
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default NonAuth;
