import {
    Building2,
    Car,
    Hospital,
    Hotel,
    LayoutGrid,
    Leaf,
    Mail,
    MessageSquareQuote,
    Newspaper,
    Plane,
    Stethoscope,
} from "lucide-react";

/** Admin sidebar navigation, grouped. `labelKey` is an i18n key, `groupKey` an admin-string key. */
export const ADMIN_NAV = [
    {
        groupKey: "groupCatalog",
        items: [
            { path: "/admin/category", icon: LayoutGrid, labelKey: "adminPanel.leftBar.menu.category" },
            { path: "/admin/clinic", icon: Hospital, labelKey: "adminPanel.leftBar.menu.clinic" },
            { path: "/admin/germany-clinic", icon: Building2, labelKey: "adminPanel.leftBar.menu.clinicGermany" },
            { path: "/admin/sanatorium", icon: Leaf, labelKey: "adminPanel.leftBar.menu.sanatorium" },
            { path: "/admin/doctors", icon: Stethoscope, labelKey: "adminPanel.leftBar.menu.doctor" },
        ],
    },
    {
        groupKey: "groupTravel",
        items: [
            { path: "/admin/tours", icon: Plane, labelKey: "adminPanel.leftBar.menu.tours" },
            { path: "/admin/otel", icon: Hotel, labelKey: "adminPanel.leftBar.menu.hotel" },
            { path: "/admin/car", icon: Car, labelKey: "adminPanel.leftBar.menu.car" },
        ],
    },
    {
        groupKey: "groupEngagement",
        items: [
            { path: "/admin/serh", icon: MessageSquareQuote, labelKey: "adminPanel.leftBar.menu.comment" },
            { path: "/admin/contact", icon: Mail, labelKey: "adminPanel.leftBar.menu.contact" },
            { path: "/admin/newspaper", icon: Newspaper, labelKey: "adminPanel.leftBar.menu.newspaper" },
        ],
    },
];

const ALL_ITEMS = ADMIN_NAV.flatMap((g) => g.items);

/** Nav item whose section contains `pathname` (e.g. /admin/clinic/edit/3 → Clinic). */
export const findNavItem = (pathname) =>
    ALL_ITEMS.find((item) => pathname === item.path || pathname.startsWith(`${item.path}/`));
