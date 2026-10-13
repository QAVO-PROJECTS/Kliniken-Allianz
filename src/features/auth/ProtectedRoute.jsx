import {Navigate, useLocation} from "react-router-dom";
import {isAuthenticated} from "./authStorage.js";

/** Guards admin routes: requires a non-expired admin JWT. */
const ProtectedRoute = ({children}) => {
    const location = useLocation();
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace state={{from: location.pathname}}/>;
    }
    return children;
};

export default ProtectedRoute;
