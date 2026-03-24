import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const checkAuth = (Component) => {
  function Wrapper(props) {
    const user = useSelector(store => store.auth.user);

    if (!user?.token) {
      return <Navigate to="/" replace />;
    }

    return <Component {...props} />;
  }

  return Wrapper;
};

export default checkAuth;
