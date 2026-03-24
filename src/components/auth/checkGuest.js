import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const checkGuest = (Component) => {
  function Wrapper(props) {
    const user = useSelector(store => store.auth.user);

    if (user?.token) {
      return <Navigate to="/doctorlistingpage" replace />;
    }

    return <Component {...props} />;
  }

  return Wrapper;
};

export default checkGuest;
