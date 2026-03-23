import { Navigate } from "react-router-dom";

import { useSelector } from "react-redux";

function PublicRoute({ children }) {
  const { token } = useSelector((state) => state.user);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PublicRoute;
