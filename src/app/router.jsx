import {createBrowserRouter, Navigate} from "react-router-dom";
import RootLayout from "./RootLayout.jsx";
import RouteError from "./RouteError.jsx";
import RouteFallback from "./RouteFallback.jsx";
import PublicLayout from "../layouts/PublicLayout.jsx";
import ProtectedRoute from "../features/auth/ProtectedRoute.jsx";
import GuestRoute from "../features/auth/GuestRoute.jsx";

/**
 * Route-level code splitting: `lazy` loads the page chunk before the navigation commits,
 * so the current page stays on screen (with a top progress bar) instead of flashing a spinner.
 * Pass `props` for pages that are reused with different props (e.g. isGermany).
 */
const page = (load, props) => async () => {
    const {default: Component} = await load();
    return props ? {element: <Component {...props}/>} : {Component};
};

/** Like `page`, but wraps the loaded component (used for guarded routes). */
const guarded = (load, Guard) => async () => {
    const {default: Component} = await load();
    return {element: <Guard><Component/></Guard>};
};

const publicRoutes = [
    {index: true, lazy: page(() => import("../pages/public/Home/index.jsx"))},
    {path: "contact", lazy: page(() => import("../pages/public/Contact/index.jsx"))},
    {path: "clinics", lazy: page(() => import("../pages/public/Clinics/index.jsx"), {isGermany: false})},
    {path: "germany-clinics", lazy: page(() => import("../pages/public/Clinics/index.jsx"), {isGermany: true})},
    {path: "sanatoriums", lazy: page(() => import("../pages/public/Sanatoriums/index.jsx"))},
    {path: "sanatoriums/:id", lazy: page(() => import("../pages/public/SanatoriumDetail/index.jsx"))},
    {path: "tours", lazy: page(() => import("../pages/public/Tours/index.jsx"))},
    {path: "tours/:id", lazy: page(() => import("../pages/public/TourDetail/index.jsx"))},
    {path: "services", lazy: page(() => import("../pages/public/Services/index.jsx"))},
    {path: "services/:id", lazy: page(() => import("../pages/public/ServiceDetail/index.jsx"))},
    {path: "doctors", lazy: page(() => import("../pages/public/Doctors/index.jsx"))},
    {path: "doktor/:id", lazy: page(() => import("../pages/public/DoctorDetail/index.jsx"))},
    {path: "clinics/:id", lazy: page(() => import("../pages/public/ClinicDetail/index.jsx"))},
    {path: "category/:id", lazy: page(() => import("../pages/public/CategoryDetail/index.jsx"))},
    {path: "about", lazy: page(() => import("../pages/public/About/index.jsx"))},
    {path: "blogs", lazy: page(() => import("../pages/public/Blogs/index.jsx"))},
    {path: "blogs/:id", lazy: page(() => import("../pages/public/BlogDetail/index.jsx"))},
    {path: "cars/:id", lazy: page(() => import("../pages/public/CarDetail/index.jsx"))},
    {path: "*", lazy: page(() => import("../pages/public/NotFound/index.jsx"))},
];

const adminRoutes = [
    {index: true, element: <Navigate to="category" replace/>},

    {path: "category", lazy: page(() => import("../pages/admin/category/CategoryList/index.jsx"))},
    {path: "category/add", lazy: page(() => import("../pages/admin/category/CategoryCreate/index.jsx"))},
    {path: "category/edit/:id", lazy: page(() => import("../pages/admin/category/CategoryEdit/index.jsx"))},
    {path: "category/servis/:id", lazy: page(() => import("../pages/admin/service/ServiceList/index.jsx"))},
    {path: "category/servis/add/:id", lazy: page(() => import("../pages/admin/service/ServiceCreate/index.jsx"))},
    {path: "category/servis/edit/:id", lazy: page(() => import("../pages/admin/service/ServiceEdit/index.jsx"))},

    {path: "contact", lazy: page(() => import("../pages/admin/contact/ContactList/index.jsx"))},

    {path: "serh", lazy: page(() => import("../pages/admin/review/ReviewList/index.jsx"))},
    {path: "serh/add", lazy: page(() => import("../pages/admin/review/ReviewCreate/index.jsx"))},
    {path: "serh/edit/:id", lazy: page(() => import("../pages/admin/review/ReviewEdit/index.jsx"))},

    {path: "otel", lazy: page(() => import("../pages/admin/hotel/HotelList/index.jsx"))},
    {path: "otel/add", lazy: page(() => import("../pages/admin/hotel/HotelCreate/index.jsx"))},
    {path: "otel/edit/:id", lazy: page(() => import("../pages/admin/hotel/HotelEdit/index.jsx"))},

    {path: "tours", lazy: page(() => import("../pages/admin/tour/TourList/index.jsx"))},
    {path: "tours/add", lazy: page(() => import("../pages/admin/tour/TourCreate/index.jsx"))},
    {path: "tours/edit/:id", lazy: page(() => import("../pages/admin/tour/TourEdit/index.jsx"))},

    {path: "clinic", lazy: page(() => import("../pages/admin/clinic/ClinicList/index.jsx"))},
    {path: "clinic/add", lazy: page(() => import("../pages/admin/clinic/ClinicCreate/index.jsx"), {isGermany: false})},
    {path: "clinic/edit/:id", lazy: page(() => import("../pages/admin/clinic/ClinicEdit/index.jsx"), {isGermany: false})},
    {path: "germany-clinic", lazy: page(() => import("../pages/admin/clinic/GermanyClinicList/index.jsx"))},
    {path: "germany-clinic/add", lazy: page(() => import("../pages/admin/clinic/ClinicCreate/index.jsx"), {isGermany: true})},
    {path: "germany-clinic/edit/:id", lazy: page(() => import("../pages/admin/clinic/ClinicEdit/index.jsx"), {isGermany: true})},

    {path: "doctors", lazy: page(() => import("../pages/admin/doctor/DoctorList/index.jsx"))},
    {path: "doctors/add", lazy: page(() => import("../pages/admin/doctor/DoctorCreate/index.jsx"))},
    {path: "doctors/edit/:id", lazy: page(() => import("../pages/admin/doctor/DoctorEdit/index.jsx"))},

    {path: "sanatorium", lazy: page(() => import("../pages/admin/sanatorium/SanatoriumList/index.jsx"))},
    {path: "sanatorium/add", lazy: page(() => import("../pages/admin/sanatorium/SanatoriumCreate/index.jsx"))},
    {path: "sanatorium/edit/:id", lazy: page(() => import("../pages/admin/sanatorium/SanatoriumEdit/index.jsx"))},

    {path: "car", lazy: page(() => import("../pages/admin/car/CarList/index.jsx"))},
    {path: "car/add", lazy: page(() => import("../pages/admin/car/CarCreate/index.jsx"))},
    {path: "car/edit/:id", lazy: page(() => import("../pages/admin/car/CarEdit/index.jsx"))},

    {path: "newspaper", lazy: page(() => import("../pages/admin/blog/BlogList/index.jsx"))},
    {path: "newspaper/add", lazy: page(() => import("../pages/admin/blog/BlogCreate/index.jsx"))},
    {path: "newspaper/edit/:id", lazy: page(() => import("../pages/admin/blog/BlogEdit/index.jsx"))},
];

export const routes = [
    {
        element: <RootLayout/>,
        errorElement: <RouteError fullscreen/>,
        hydrateFallbackElement: <RouteFallback fullscreen/>,
        children: [
            {
                path: "/",
                element: <PublicLayout/>,
                children: [
                    // Pathless wrapper so page errors render inside the public layout (navbar/footer stay).
                    {errorElement: <RouteError/>, children: publicRoutes},
                ],
            },
            {
                path: "/admin",
                // Guard runs before the admin layout chunk is rendered.
                lazy: guarded(() => import("../layouts/AdminLayout/index.jsx"), ProtectedRoute),
                children: [
                    {errorElement: <RouteError/>, children: adminRoutes},
                ],
            },
            {
                path: "/login",
                lazy: guarded(() => import("../features/auth/LoginPage/index.jsx"), GuestRoute),
            },
        ],
    },
];

// Created once at module scope (never inside a component), so navigation state survives re-renders.
export const router = createBrowserRouter(routes);

export default router;
