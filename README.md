# Kliniken Allianz — frontend

Public website and admin panel for **Kliniken Allianz**, a medical-tourism service: clinics (incl. Germany),
sanatoriums, doctors, treatment categories and services, tours, cars, hotels and a blog. Four languages:
Azerbaijani (default), English, Russian and Arabic (right-to-left).

## Stack

- **React 19** + **Vite 6** (SWC plugin)
- **React Router 7** (`createBrowserRouter`; every page is loaded lazily with the route `lazy` option)
- **Redux Toolkit / RTK Query** for API calls and caching (`src/api/userApi.js`)
- **i18next** + `react-i18next`, with translations loaded over HTTP from `public/locales/<lng>/translation.json`
- **Sass** with design tokens (`src/styles/_tokens.scss`) and shared mixins and components
- Supporting libraries: lucide-react (icons), AOS (scroll animations), react-toastify, react-slick, react-quill-new (admin editor), three.js (decorative 3D)

## Getting started

```sh
npm install
cp .env.example .env.local   # optional; the defaults point at production
npm run dev                  # http://localhost:3000
```

| Script            | What it does                              |
|-------------------|-------------------------------------------|
| `npm run dev`     | Vite dev server with HMR (port 3000)      |
| `npm run build`   | Production build to `dist/`               |
| `npm run preview` | Serve the production build locally        |
| `npm run lint`    | ESLint over the project                   |

## Environment variables

Vite reads these at **build time** (see `.env.example`):

| Variable          | Default                                 | Used for                                 |
|-------------------|-----------------------------------------|------------------------------------------|
| `VITE_API_URL`    | `https://api.kliniken-allianz.com/api`  | RTK Query base URL                       |
| `VITE_FILES_URL`  | `https://api.kliniken-allianz.com/files`| Uploaded images and certificates (`src/config/mediaUrls.js`) |
| `VITE_I18N_DEBUG` | unset                                   | `true` turns on i18next debug logs in dev |

`VITE_BUILD_ID` is set automatically by `vite.config.js` and busts the browser cache for translation files on each deploy.

## Folder structure

```
src/
  main.jsx                 entry: Redux provider + i18n bootstrap
  app/                     App shell: App.jsx (splash, toasts), router.jsx (all routes),
                           store.js, uiSlice.js, RootLayout / RouteFallback / RouteError
  api/userApi.js           RTK Query API: every endpoint and hook, plus cache tags
  config/mediaUrls.js      URLs for uploaded media, all derived from VITE_FILES_URL
  features/auth/           authStorage (JWT cookie), ProtectedRoute, GuestRoute, LoginPage
  i18n/                    i18next setup (index.js) and getLocalizedText() for API fields
  layouts/                 PublicLayout (navbar + footer), AdminLayout (sidebar)
  components/
    layout/                Navbar, Footer, SplashScreen, ScrollToTop
    ui/                    PageHeader, SectionTitle, Pagination, …
    cards/                 Clinic, Doctor, Tour, Blog … cards
    admin/                 admin-only widgets
    decor/                 decorative visuals
  pages/
    public/<Page>/         Home, Clinics, ClinicDetail, Doctors, Tours, Blogs, Contact, …
    admin/<entity>/        XList, XCreate, XEdit per entity (category, clinic, doctor, …)
  styles/                  _tokens, _mixins, _components, _base (design system)
  utils/toast.js           toast helper
  assets/                  images and light videos
public/
  locales/{az,en,ru,ar}/translation.json
  .htaccess, web.config    SPA fallback for Apache / IIS (Plesk)
```

## Conventions

- **Localized API fields**: the backend returns `name`, `nameEng`, `nameRu`, `nameAlm`, `nameArab` (and the same pattern
  for `description`, `location`, …). Always read them with `getLocalizedText(item, 'name')` from `src/i18n/getLocalizedText.js`.
  It falls back from the active language to English, then to Azerbaijani.
- **Translations**: use `t('section.key')`. When adding keys, add them to all four locale files. Arabic switches
  `<html dir="rtl">` automatically, so prefer CSS logical properties (`margin-inline-start`, `inset-inline-end`, …).
- **Styling**: use `var(--token)` values from `_tokens.scss` and the mixins (`@use '…/styles/mixins' as *`).
  Avoid hard-coded colours.
- **Data fetching**: use the hooks from `userApi.js`. Mutations invalidate the matching cache tags, so lists
  refresh on their own and you don't need to call `refetch()` by hand.
- **Auth**: the admin JWT is kept in the `klinikenToken` cookie, and only `features/auth/authStorage.js` touches it.
  Expired tokens are never sent. A `401` clears the token and redirects to `/login`.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and uploads `dist/` over FTP to Plesk (`httpdocs/`).
Client-side routes depend on the SPA fallback in `public/.htaccess` (Apache) or `public/web.config` (IIS).
`vercel.json` does the same job on Vercel.
