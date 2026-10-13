import Cookies from "js-cookie";

// Single place that knows how the admin JWT is stored.
const TOKEN_KEY = "klinikenToken";

const decodePayload = (token) => {
    try {
        const part = token.split(".")[1];
        if (!part) return null;
        const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(json);
    } catch {
        return null;
    }
};

export const getToken = () => {
    const token = Cookies.get(TOKEN_KEY);
    return token && token !== "null" ? token : null;
};

/** True when a token exists and its `exp` claim is still in the future. */
export const isAuthenticated = () => {
    const token = getToken();
    if (!token) return false;
    const exp = decodePayload(token)?.exp;
    return typeof exp === "number" ? exp * 1000 > Date.now() : false;
};

/** Returns the token only when it is still valid, so expired tokens are never sent. */
export const getValidToken = () => (isAuthenticated() ? getToken() : null);

/**
 * @param {string} token
 * @param {string|Date} [expireDate] server-provided expiry; falls back to the JWT `exp`
 */
export const setToken = (token, expireDate) => {
    const exp = decodePayload(token)?.exp;
    const expires = expireDate ? new Date(expireDate) : exp ? new Date(exp * 1000) : 1;
    Cookies.set(TOKEN_KEY, token, {
        expires,
        sameSite: "strict",
        secure: window.location.protocol === "https:",
    });
};

export const clearToken = () => Cookies.remove(TOKEN_KEY);
