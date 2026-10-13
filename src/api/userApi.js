import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {getToken, getValidToken, clearToken} from "../features/auth/authStorage.js";

export const API_URL = (import.meta.env.VITE_API_URL || 'https://api.kliniken-allianz.com/api').replace(/\/+$/, '');

const TAG_TYPES = ['Category', 'Clinic', 'Doctor', 'Service', 'Otel', 'Tour', 'Sanatorium', 'Car', 'Newspaper', 'CustomerView', 'Contact', 'Form'];
const LIST = 'LIST';

// --- cache tag helpers -------------------------------------------------------
// Every response has the shape { statusCode, data } where data is a list or an object.

const provideList = (type) => (result) => {
    const items = Array.isArray(result?.data) ? result.data : [];
    return [
        ...items.filter((item) => item?.id != null).map(({id}) => ({type, id})),
        {type, id: LIST},
    ];
};

const provideOne = (type) => (result, error, id) => [{type, id: result?.data?.id ?? id}];

/** Reads the entity id from a JSON body or a FormData body (admin edit forms send FormData). */
const idOf = (body) => {
    if (typeof FormData !== 'undefined' && body instanceof FormData) return body.get('id');
    return body?.id;
};

const invalidateList = (type, ...related) => () => [{type, id: LIST}, ...related];
const invalidateUpdated = (type, ...related) => (result, error, body) => {
    const id = idOf(body);
    return [{type, id: LIST}, ...(id != null ? [{type, id}] : []), ...related];
};
const invalidateDeleted = (type, ...related) => (result, error, id) => [{type, id: LIST}, {type, id}, ...related];

// --- base query --------------------------------------------------------------

const rawBaseQuery = fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
        const token = getValidToken();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

/** On 401 for a request made with a (possibly expired) admin token: log out and go to /login. */
const baseQueryWithAuth = async (args, api, extraOptions) => {
    const hadToken = Boolean(getToken());
    const result = await rawBaseQuery(args, api, extraOptions);
    if (result.error?.status === 401 && hadToken) {
        clearToken();
        api.dispatch(userApi.util.resetApiState());
        if (!window.location.pathname.startsWith('/login')) {
            window.location.assign('/login');
        }
    }
    return result;
};

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: baseQueryWithAuth,
    tagTypes: TAG_TYPES,
    endpoints: (builder) => ({
        postAdminLogin: builder.mutation({
            query: (admin) => ({
                url: `/Admin/login`,
                method: 'POST',
                body: admin,
                headers: {'Content-Type': 'application/json'}
            }),
        }),
        getAllCategory: builder.query({
            query: () => ({
                url: `/Category/get-all-categories`,
            }),
            providesTags: provideList('Category'),
        }),
        getCategoryById: builder.query({
            query: (id) => ({
                url: `/Category/get-category-by-id/${id}`,
            }),
            providesTags: provideOne('Category'),
        }),
        putCategory: builder.mutation({
            query: (category) => ({
                url: `/Category/update-category`,
                method: 'PUT',
                body: category,
            }),
            invalidatesTags: invalidateUpdated('Category', 'Service'),
        }),
        postCategory: builder.mutation({
            query: (data) => ({
                url: `/Category/create-category`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: invalidateList('Category', 'Service'),
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/Category/delete-category/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: invalidateDeleted('Category', 'Service'),
        }),
        getAllClinic: builder.query({
            query: () => ({
                url: `/Clinic/get-all-clinics`,
            }),
            providesTags: provideList('Clinic'),
        }),
        getClinicByCategory: builder.query({
            query: (categoryId) => ({
                url: `/Clinic/get-clinics-by-category/${categoryId}`,
            }),
            providesTags: provideList('Clinic'),
        }),

        getClinicById: builder.query({
            query: (id) => ({
                url: `/Clinic/get-clinic-by-id/${id}`,
            }),
            providesTags: provideOne('Clinic'),
        }),
        putClinic: builder.mutation({
            query: (clinic) => ({
                url: `/Clinic/update-clinic`,
                method: 'PUT',
                body: clinic,
            }),
            invalidatesTags: invalidateUpdated('Clinic', 'Service', 'Category'),
        }),
        postClinic: builder.mutation({
            query: (data) => ({
                url: `/Clinic/create-clinic`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: invalidateList('Clinic', 'Service', 'Category'),
        }),
        deleteClinic: builder.mutation({
            query: (id) => ({
                url: `/Clinic/delete-clinic/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: invalidateDeleted('Clinic', 'Service', 'Category'),
        }),
        getAllDoctors: builder.query({
            query: () => ({
                url: `/Doctors/get-all-doctors`,
            }),
            providesTags: provideList('Doctor'),
        }),
        getDoctorsById: builder.query({
            query: (id) => ({
                url: `/Doctors/get-doctor-by-id/${id}`,
            }),
            providesTags: provideOne('Doctor'),
        }),
        putDoctors: builder.mutation({
            query: (doctor) => ({
                url: `/Doctors/update-doctor`,
                method: 'PUT',
                body: doctor,
            }),
            invalidatesTags: invalidateUpdated('Doctor', 'Clinic'),
        }),
        postDoctors: builder.mutation({
            query: (data) => ({
                url: `/Doctors/create-doctor`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: invalidateList('Doctor', 'Clinic'),
        }),
        deleteDoctors: builder.mutation({
            query: (id) => ({
                url: `/Doctors/delete-doctor/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: invalidateDeleted('Doctor', 'Clinic'),
        }),
        getAllService: builder.query({
            query: () => ({
                url: `/Service/get-all-services`,
            }),
            providesTags: provideList('Service'),
        }),
        getServiceById: builder.query({
            query: (id) => ({
                url: `/Service/get-service/${id}`,
            }),
            providesTags: provideOne('Service'),
        }),
        putService: builder.mutation({
            query: (service) => ({
                url: `/Service/update-service`,
                method: 'PUT',
                body: service,
            }),
            invalidatesTags: invalidateUpdated('Service', 'Category', 'Clinic', 'Sanatorium'),
        }),
        postService: builder.mutation({
            query: (data) => ({
                url: `/Service/create-service`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: invalidateList('Service', 'Category', 'Clinic', 'Sanatorium'),
        }),
        deleteService: builder.mutation({
            query: (id) => ({
                url: `/Service/delete-service/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: invalidateDeleted('Service', 'Category', 'Clinic', 'Sanatorium'),
        }),
        postContact: builder.mutation({
            query: (contact) => ({
                url: `/Contact/create-contact`,
                method: 'POST',
                body: contact,
                headers: {'Content-Type': 'application/json'}
            }),
            invalidatesTags: invalidateList('Contact'),
        }),
        postContactTour: builder.mutation({
            query: (contact) => ({
                url: `/Contact/create-tour-contact`,
                method: 'POST',
                body: contact,
                headers: {'Content-Type': 'application/json'}
            }),
            invalidatesTags: invalidateList('Contact'),
        }),
        postContactService: builder.mutation({
            query: (contact) => ({
                url: `/Contact/create-service-contact`,
                method: 'POST',
                body: contact,
                headers: {'Content-Type': 'application/json'}
            }),
            invalidatesTags: invalidateList('Contact'),
        }),
        postContactClinic: builder.mutation({
            query: (contact) => ({
                url: `/Contact/create-clinic-contact`,
                method: 'POST',
                body: contact,
                headers: {'Content-Type': 'application/json'}
            }),
            invalidatesTags: invalidateList('Contact'),
        }),
        postContactSanatorium: builder.mutation({
            query: (contact) => ({
                url: `/Contact/create-sanatorium-contact`,
                method: 'POST',
                body: contact,
                headers: {'Content-Type': 'application/json'}
            }),
            invalidatesTags: invalidateList('Contact'),
        }),
        getAllContact: builder.query({
            query: () => ({
                url: `/Contact/get-all-contacts`,
            }),
            providesTags: provideList('Contact'),
        }),
        getAllOtels: builder.query({
            query: () => ({
                url: `/Otels/get-all-otels`,
            }),
            providesTags: provideList('Otel'),
        }),
        getOtelsById: builder.query({
            query: (id) => ({
                url: `/Otels/get-otel-by-id/${id}`,
            }),
            providesTags: provideOne('Otel'),
        }),
        putOtels: builder.mutation({
            query: (otel) => ({
                url: `/Otels/update-otel`,
                method: 'PUT',
                body: otel,
            }),
            invalidatesTags: invalidateUpdated('Otel', 'Clinic'),
        }),
        postOtels: builder.mutation({
            query: (data) => ({
                url: `/Otels/create-otel`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: invalidateList('Otel', 'Clinic'),
        }),
        deleteOtels: builder.mutation({
            query: (id) => ({
                url: `/Otels/delete-otel/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: invalidateDeleted('Otel', 'Clinic'),
        }),
        getAllCustomerView: builder.query({
            query: () => ({
                url: `/CustomerView/get-all-customer-views`,
            }),
            providesTags: provideList('CustomerView'),
        }),
        getCustomerViewById: builder.query({
            query: (id) => ({
                url: `/CustomerView/get-customer-view-by-id/${id}`,
            }),
            providesTags: provideOne('CustomerView'),
        }),
        putCustomerView: builder.mutation({
            query: (service) => ({
                url: `/CustomerView/update-customer-view`,
                method: 'PUT',
                body: service,
            }),
            invalidatesTags: invalidateUpdated('CustomerView'),
        }),
        postCustomerView: builder.mutation({
            query: (data) => ({
                url: `/CustomerView/create-customer-view`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: invalidateList('CustomerView'),
        }),
        deleteCustomerView: builder.mutation({
            query: (id) => ({
                url: `/CustomerView/delete-customer-view/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: invalidateDeleted('CustomerView'),
        }),
        getAllTours: builder.query({
            query: () => ({
                url: `/Tours/get-all-tours`,
            }),
            providesTags: provideList('Tour'),
        }),
        getToursById: builder.query({
            query: (id) => ({
                url: `/Tours/get-tour-by-id/${id}`,
            }),
            providesTags: provideOne('Tour'),
        }),
        putTours: builder.mutation({
            query: (doctor) => ({
                url: `/Tours/update-tour`,
                method: 'PUT',
                body: doctor,
            }),
            invalidatesTags: invalidateUpdated('Tour'),
        }),
        postTours: builder.mutation({
            query: (data) => ({
                url: `/Tours/create-tour`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: invalidateList('Tour'),
        }),
        deleteTours: builder.mutation({
            query: (id) => ({
                url: `/Tours/delete-tour/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: invalidateDeleted('Tour'),
        }),
        getAllSanatorium: builder.query({
            query: () => ({
                url: `/Sanatorium/get-all-sanatoriums`,
            }),
            providesTags: provideList('Sanatorium'),
        }),

        getSanatoriumById: builder.query({
            query: (id) => ({
                url: `/Sanatorium/get-sanatorium/${id}`,
            }),
            providesTags: provideOne('Sanatorium'),
        }),
        putSanatorium: builder.mutation({
            query: (sanatorium) => ({
                url: `/Sanatorium/update-sanatorium`,
                method: 'PUT',
                body: sanatorium,
            }),
            invalidatesTags: invalidateUpdated('Sanatorium'),
        }),
        postSanatorium: builder.mutation({
            query: (data) => ({
                url: `/Sanatorium/create-sanatorium`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: invalidateList('Sanatorium'),
        }),
        deleteSanatorium: builder.mutation({
            query: (id) => ({
                url: `/Sanatorium/delete-sanatorium/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: invalidateDeleted('Sanatorium'),
        }),
        getAllCar: builder.query({
            query: () => ({
                url: `/Car/get-all-cars`,
            }),
            providesTags: provideList('Car'),
        }),
        getCarById: builder.query({
            query: (id) => ({
                url: `/Car/get-car-by-id/${id}`,
            }),
            providesTags: provideOne('Car'),
        }),
        putCar: builder.mutation({
            query: (car) => ({
                url: `/Car/update-car`,
                method: 'PUT',
                body: car,
            }),
            invalidatesTags: invalidateUpdated('Car'),
        }),
        postCar: builder.mutation({
            query: (data) => ({
                url: `/Car/create-car`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: invalidateList('Car'),
        }),
        deleteCar: builder.mutation({
            query: (id) => ({
                url: `/Car/delete-car/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: invalidateDeleted('Car'),
        }),
        getAllNewspaper: builder.query({
            query: () => ({
                url: `/Newspaper/get-all-newspapers`,
            }),
            providesTags: provideList('Newspaper'),
        }),
        getNewspaperById: builder.query({
            query: (id) => ({
                url: `/Newspaper/get-newspaper-by-id/${id}`,
            }),
            providesTags: provideOne('Newspaper'),
        }),
        putNewspaper: builder.mutation({
            query: (newspaper) => ({
                url: `/Newspaper/update-newspaper`,
                method: 'PUT',
                body: newspaper,
            }),
            invalidatesTags: invalidateUpdated('Newspaper'),
        }),
        postNewspaper: builder.mutation({
            query: (data) => ({
                url: `/Newspaper/create-newspaper`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: invalidateList('Newspaper'),
        }),
        deleteNewspaper: builder.mutation({
            query: (id) => ({
                url: `/Newspaper/delete-newspaper/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: invalidateDeleted('Newspaper'),
        }),
    }),
})
export const {
    usePostAdminLoginMutation,

    useGetAllCategoryQuery,
    useGetCategoryByIdQuery,
    usePutCategoryMutation,
    useDeleteCategoryMutation,
    usePostCategoryMutation,
    useGetClinicByCategoryQuery,

    useGetAllClinicQuery,
    useGetClinicByIdQuery,
    usePutClinicMutation,
    useDeleteClinicMutation,
    usePostClinicMutation,
    useGetAllCarQuery,
    useGetCarByIdQuery,
    usePutCarMutation,
    useDeleteCarMutation,
    usePostCarMutation,
    useGetAllSanatoriumQuery,
    useGetSanatoriumByIdQuery,
    usePutSanatoriumMutation,
    useDeleteSanatoriumMutation,
    usePostSanatoriumMutation,

    useGetAllNewspaperQuery,
    useGetNewspaperByIdQuery,
    usePutNewspaperMutation,
    useDeleteNewspaperMutation,
    usePostNewspaperMutation,

    useGetAllDoctorsQuery,
    useGetDoctorsByIdQuery,
    usePutDoctorsMutation,
    useDeleteDoctorsMutation,
    usePostDoctorsMutation,

    useGetAllServiceQuery,
    useGetServiceByIdQuery,
    usePutServiceMutation,
    useDeleteServiceMutation,
    usePostServiceMutation,

    usePostContactMutation,
    usePostContactClinicMutation,
    usePostContactSanatoriumMutation,
    usePostContactTourMutation,
    usePostContactServiceMutation,
    useGetAllContactQuery,

    useGetAllOtelsQuery,
    useGetOtelsByIdQuery,
    usePutOtelsMutation,
    useDeleteOtelsMutation,
    usePostOtelsMutation,
    useLazyGetServiceByIdQuery,

    useGetAllCustomerViewQuery,
    useGetCustomerViewByIdQuery,
    usePutCustomerViewMutation,
    useDeleteCustomerViewMutation,
    usePostCustomerViewMutation,

    useGetAllToursQuery,
    useGetToursByIdQuery,
    usePutToursMutation,
    useDeleteToursMutation,
    usePostToursMutation,

} = userApi