import {Outlet, useNavigation} from "react-router-dom";

/** Top-level route element: renders the matched layout plus a slim navigation progress bar. */
function RootLayout() {
    const navigation = useNavigation();
    const busy = navigation.state === "loading";
    return (
        <>
            <div className={`route-progress${busy ? " is-active" : ""}`} aria-hidden="true"/>
            <Outlet/>
        </>
    );
}

export default RootLayout;
