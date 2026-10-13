import {Navigate} from "react-router-dom";
import {isAuthenticated} from "./authStorage.js";

/** Renders its children (the login page) only for visitors who are not signed in. */
const GuestRoute = ({children, redirectTo = "/admin/category"}) =>
    isAuthenticated() ? <Navigate to={redirectTo} replace/> : children;

export default GuestRoute;
