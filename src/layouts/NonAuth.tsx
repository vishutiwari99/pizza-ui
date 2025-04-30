import { Outlet } from "react-router-dom";

const NonAuth = () => {
  return (
    <div>
      <h2>Non Auth</h2>
      <Outlet />
    </div>
  );
};

export default NonAuth;
