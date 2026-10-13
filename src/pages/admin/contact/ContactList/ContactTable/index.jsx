import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Inbox } from "lucide-react";
import { useGetAllContactQuery } from "../../../../../api/userApi.js";
import AdminDataTable from "../../../../../components/admin/AdminDataTable/index.jsx";
import ExpandableText from "../../../../../components/admin/ExpandableText/index.jsx";
import FilterDropdown from "../../../../../components/admin/FilterBar/index.jsx";

const fullName = (item) => [item.name, item.surname].filter(Boolean).join(" ");
const subject = (item) => item.tourName || item.serviceName || item.clinicName || "";

function ContactTableNew({ filter, onFilterChange }) {
    const { t } = useTranslation();
    const { data: getAllContact, isLoading } = useGetAllContactQuery();
    const contacts = getAllContact?.data;

    const filteredContacts = useMemo(() => {
        if (!contacts) return [];
        switch (filter) {
            case "tour":
                return contacts.filter((c) => c.tourId || c.tourName);
            case "clinic":
                return contacts.filter((c) => c.clinicId || c.clinicName);
            case "service":
                return contacts.filter((c) => c.serviceId || c.serviceName);
            default:
                return contacts;
        }
    }, [contacts, filter]);

    const columns = [
        {
            key: "name",
            header: t("adminPanel.contactTable.headers.name"),
            className: "is-nowrap",
            render: (item) => <span className="adm-cell-title">{fullName(item) || "-"}</span>,
        },
        {
            key: "email",
            header: t("adminPanel.contactTable.headers.email"),
            render: (item) => (item.email ? <a className="adm-link" href={`mailto:${item.email}`}>{item.email}</a> : "-"),
        },
        {
            key: "note",
            header: t("adminPanel.contactTable.headers.note"),
            render: (item) => <ExpandableText text={item.description} />,
        },
        {
            key: "subject",
            header: t("adminPanel.contactTable.headers.tourName"),
            render: (item) => (subject(item) ? <span className="badge badge--brand">{subject(item)}</span> : <span className="adm-cell-muted">-</span>),
        },
        {
            key: "phone",
            header: t("adminPanel.contactTable.headers.phone"),
            className: "is-nowrap",
            render: (item) => (item.phoneNumber ? <a className="adm-link" href={`tel:${item.phoneNumber.replace(/\s+/g, "")}`}>{item.phoneNumber}</a> : "-"),
        },
    ];

    return (
        <AdminDataTable
            columns={columns}
            rows={filteredContacts}
            rowKey={(item) => item.id}
            loading={isLoading}
            searchText={(item) => `${fullName(item)} ${item.email || ""} ${item.phoneNumber || ""} ${subject(item)}`}
            toolbarEnd={<FilterDropdown selected={filter} onChange={onFilterChange} />}
            emptyIcon={Inbox}
            emptyTitle={t("adminPanel.contactTable.emptyMessage")}
            emptyText=""
        />
    );
}

export default ContactTableNew;
