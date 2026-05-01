import MainPage from "../pages/index.jsx";
import AdminPage from "../components/AdminComponents/AdminPage/index.jsx";
import NotFound from "../pages/UserPages/Not Found/NotFound.jsx";
import Contact from "../pages/UserPages/Contact/index.jsx";
// import Services from "../pages/UserPages/Services/index.jsx";
import AboutUs from "../pages/UserPages/AboutUs/index.jsx";
import AdminLogin from "../pages/AdminPages/AdminLogin/index.jsx";
import ProtectedRoute from "../ProtectedRoute.jsx";
import ServiceDetail from "../pages/UserPages/ServiceDetail/index.jsx";
import ClinicDetail from "../pages/UserPages/ClinicDetail/index.jsx";
import Home from "../pages/UserPages/Home/index.jsx";
import NotResult from "../pages/UserPages/Not Result/index.jsx";
import CategorDetail from "../pages/UserPages/CategorDetail/index.jsx";
import DoktorDetail from "../pages/UserPages/DoktorDetail/index.jsx";
import AdminCategory from "../pages/AdminPages/AdminCategory/index.jsx";
import AdminClinic from "../pages/AdminPages/AdminClinic/index.jsx";
import AdminDoktor from "../pages/AdminPages/AdminDoktor/index.jsx";
import AdminServices from "../pages/AdminPages/AdminServices/index.jsx";
import AdminContact from "../pages/AdminPages/AdminContact/index.jsx";
import AdminOtel from "../pages/AdminPages/AdminOtels/index.jsx";
import ClinicsPage from "../pages/UserPages/ClinicsPage/index.jsx";
import ServicesPage from "../pages/UserPages/ServicesPage/index.jsx";
import ToursPage from "../pages/UserPages/ToursPage/index.jsx";
import ClinicsDoctorPage from "../pages/UserPages/ClinicsDoctorPage/index.jsx";
import DoctorsPage from "../pages/UserPages/DoctorsPage/index.jsx";
import TourDetail from "../pages/UserPages/TourDetail/index.jsx";
import AdminCategoryNew from "../pages/AdminPagesNew/AdminCategoryNew/index.jsx";
import CategoryAdd from "../pages/AdminPagesNew/AdminCategoryAdd/index.jsx";
import AdminCategoryServisNew from "../pages/AdminPagesNew/AdminCategoryServisNew/index.jsx";
import CategoryServisAdd from "../pages/AdminPagesNew/AdminCategoryServisAdd/index.jsx";
import CategoryServisEdit from "../pages/AdminPagesNew/AdminCategoryServisEdit/index.jsx";
import AdminContactNew from "../pages/AdminPagesNew/AdminContactNew/index.jsx";
import AdminSerhNew from "../pages/AdminPagesNew/AdminSerhNew/index.jsx";
import SerhAdd from "../pages/AdminPagesNew/AdminSerhAdd/index.jsx";
import SerhEdit from "../pages/AdminPagesNew/AdminSerhEdit/index.jsx";
import AdminOtelNew from "../pages/AdminPagesNew/AdminOtelNew/index.jsx";
import OtelAdd from "../pages/AdminPagesNew/AdminOtelAdd/index.jsx";
import OtelEdit from "../pages/AdminPagesNew/AdminOtelEdit/index.jsx";
import AdminToursNew from "../pages/AdminPagesNew/AdminToursNew/index.jsx";
import ToursAdd from "../pages/AdminPagesNew/AdminToursAdd/index.jsx";
import ToursEdit from "../pages/AdminPagesNew/AdminToursEdit/index.jsx";
import AdminClinicNew from "../pages/AdminPagesNew/AdminClinicaNew/index.jsx";
import ClinicAdd from "../pages/AdminPagesNew/AdminClinicAdd/index.jsx";
import ClinicEdit from "../pages/AdminPagesNew/AdminClinicEdit/index.jsx";
import AdminGermanyClinicNew from "../pages/AdminPagesNew/AdminGermanyClinicNew/index.jsx";
import AdminDoctorNew from "../pages/AdminPagesNew/AdminDoctorNew/index.jsx";
import DoctorAdd from "../pages/AdminPagesNew/AdminDoctorAdd/index.jsx";
import DoctorEdit from "../pages/AdminPagesNew/AdminDoctorEdit/index.jsx";
import CategoryEdit from "../pages/AdminPagesNew/AdminCategoryEdit/index.jsx";
import AdminSanatoriumNew from "../pages/AdminPagesNew/AdminSanatoriumNew/index.jsx";
import SanatoriumAdd from "../pages/AdminPagesNew/AdminSanatoriumAdd/index.jsx";
import SanatoriumEdit from "../pages/AdminPagesNew/AdminSanatoriumEdit/index.jsx";
import SanatoriumsPage from "../pages/UserPages/SanatoriumsPage/index.jsx";
import SanatoriumDetail from "../pages/UserPages/SanatoriumDetail/index.jsx";
import AdminCarNew from "../pages/AdminPagesNew/AdminCar/index.jsx";
import AdminCarAdd from "../pages/AdminPagesNew/AdminCarAdd/index.jsx";
import AdminCarEdit from "../pages/AdminPagesNew/AdminCarEdit/index.jsx";
import AdminNewspaperNew from "../pages/AdminPagesNew/AdminNewspaper/index.jsx";
import AdminNewspaperAdd from "../pages/AdminPagesNew/AdminNewspaperAdd/index.jsx";
import AdminNewspaperEdit from "../pages/AdminPagesNew/AdminNewspaperEdit/index.jsx";
import Blogs from "../pages/UserPages/Blogs/index.jsx";
import BlogDetail from "../pages/UserPages/BlogDetail/index.jsx";
import { element } from "three/tsl";
import CarDetail from "../pages/UserPages/CarDetail/index.jsx";

const router = [
    {
        path: '/',
        element: <MainPage/>,
        children: [
            {
                path: "/",
                element: <Home/>
            },
            {
                path: "/contact",
                element: <Contact/>
            },
            {
                path: "/clinics",
                element: <ClinicsPage isGermany={false}/>
            },
            {
                path: "/germany-clinics",
                element: <ClinicsPage isGermany={true}/>
            },
            {
                path: "/sanatoriums",
                element: <SanatoriumsPage/>
            },
            {
                path: "/sanatoriums/:id",
                element: <SanatoriumDetail/>
            },
            {
                path: "/tours",
                element: <ToursPage/>
            },
            {
                path: "/tours/:id",
                element: <TourDetail/>
            },
            {
                path: "/clinics-doctor/:id",
                element: <ClinicsDoctorPage/>
            },
            {
                path: "/services",
                element: <ServicesPage/>
            },
            {
                path: "/doctors",
                element: <DoctorsPage/>
            },
            {
                path: "/services/:id",
                element: <ServiceDetail/>
            },
            {
                path: "/clinics/:id",
                element: <ClinicDetail/>
            },
            {
                path: "/category/:id",
                element: <CategorDetail/>
            },
            {
                path: "/doktor/:id",
                element: <DoktorDetail/>
            },
            {
                path: "/about",
                element: <AboutUs/>
            },
            {
                path: "/blogs",
                element: <Blogs/>
            },
            {
                path: "/blogs/:id",
                element: <BlogDetail/>
            },
            {
                path:'/cars/:id',
                element: <CarDetail/>
            }
        ]
    },
    {
        path: "/admin",
        element: (
            <ProtectedRoute>
                <AdminPage/>
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/admin/category",
                element: <AdminCategoryNew/>
            },
            {
                path: "/admin/category/add",
                element: <CategoryAdd/>
            },
            {
                path: "/admin/category/edit/:id",
                element: <CategoryEdit/>
            },
            {
                path: "/admin/category/servis/:id",
                element: <AdminCategoryServisNew/>
            },
            {
                path: "/admin/category/servis/add/:id",
                element: <CategoryServisAdd/>
            },
            {
                path: "/admin/category/servis/edit/:id",
                element: <CategoryServisEdit/>
            },
            {
                path: "/admin/contact",
                element: <AdminContactNew/>
            },
            {
                path: "/admin/serh",
                element: <AdminSerhNew/>
            },
            {
                path: "/admin/serh/add",
                element: <SerhAdd/>
            },
            {
                path: "/admin/serh/edit/:id",
                element: <SerhEdit/>
            },
            {
                path: "/admin/otel",
                element: <AdminOtelNew/>
            },
            {
                path: "/admin/otel/add",
                element: <OtelAdd/>
            },
            {
                path: "/admin/otel/edit/:id",
                element: <OtelEdit/>
            },
            {
                path: "/admin/tours",
                element: <AdminToursNew/>
            },
            {
                path: "/admin/tours/add",
                element: <ToursAdd/>
            },
            {
                path: "/admin/tours/edit/:id",
                element: <ToursEdit/>
            },
            {
                path: "/admin/clinic",
                element: <AdminClinicNew/>
            },
            {
                path: "/admin/clinic/add",
                element: <ClinicAdd isGermany={false}/>
            },
            {
                path: "/admin/clinic/edit/:id",
                element: <ClinicEdit isGermany={false}/>
            },
            {
                path: "/admin/germany-clinic",
                element: <AdminGermanyClinicNew/>
            },
            {
                path: "/admin/germany-clinic/add",
                element: <ClinicAdd isGermany={true}/>
            },
            {
                path: "/admin/germany-clinic/edit/:id",
                element: <ClinicEdit isGermany={true}/>
            },
            {
                path: "/admin/doctors",
                element: <AdminDoctorNew/>
            },
            {
                path: "/admin/doctors/add",
                element: <DoctorAdd/>
            },
            {
                path: "/admin/doctors/edit/:id",
                element: <DoctorEdit/>
            },
            {
                path: "/admin/sanatorium",
                element: <AdminSanatoriumNew/>
            },
            {
                path: "/admin/sanatorium/add",
                element: <SanatoriumAdd/>
            },
            {
                path: "/admin/sanatorium/edit/:id",
                element: <SanatoriumEdit/>
            },
            {
                path: "/admin/car",
                element: <AdminCarNew/>
            },
            {
                path: "/admin/car/add",
                element: <AdminCarAdd/>
            },
            {
                path: "/admin/car/edit/:id",
                element: <AdminCarEdit/>
            },
            {
                path: "/admin/newspaper",
                element: <AdminNewspaperNew/>
            },
            {
                path: "/admin/newspaper/add",
                element: <AdminNewspaperAdd/>
            },
            {
                path: "/admin/newspaper/edit/:id",
                element: <AdminNewspaperEdit/>
            },
        ]
    },
    {
      path: "/login",
      element: <AdminLogin/>
    },
    {
        path: "*",
        element: <NotFound/>
    }
];

export default router;
