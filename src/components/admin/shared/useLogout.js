import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearToken } from "../../../features/auth/authStorage.js";
import { userApi } from "../../../api/userApi.js";

/** Clears only the admin session (token + RTK Query cache) and goes to /login. */
export function useLogout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    return useCallback(() => {
        clearToken();
        dispatch(userApi.util.resetApiState());
        navigate("/login", { replace: true });
    }, [dispatch, navigate]);
}
