import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Trash2 } from "lucide-react";
import { useDeleteToursMutation, useGetAllToursQuery } from "../../../../../api/userApi.js";
import { TOUR_CARD_IMG } from "../../../../../config/mediaUrls.js";
import AdminDataTable from "../../../../../components/admin/AdminDataTable/index.jsx";
import IconButton from "../../../../../components/admin/IconButton/index.jsx";
import ConfirmDialog from "../../../../../components/admin/ConfirmDialog/index.jsx";
import ExpandableText from "../../../../../components/admin/ExpandableText/index.jsx";
import { useDeleteConfirm } from "../../../../../components/admin/shared/useDeleteConfirm.js";
import { pickLocalized } from "../../../../../components/admin/shared/localize.js";
import { useAdminT } from "../../../../../components/admin/shared/adminStrings.js";

function ToursTableNew({ language }) {
    const { t } = useTranslation();
    const at = useAdminT();
    const { data: getAllTours, isLoading, refetch } = useGetAllToursQuery();
    const tours = getAllTours?.data;
    const [deleteTour, { isLoading: isDeleting }] = useDeleteToursMutation();
    const del = useDeleteConfirm(deleteTour, {
        successMessage: t("adminPanel.toursTable.toast.deleteSuccess"),
        errorMessage: t("adminPanel.toursTable.toast.deleteError"),
        onSuccess: refetch,
    });

    useEffect(() => {
        refetch();
    }, [refetch]);

    const name = (item) => pickLocalized(item, "name", language);
    const offers = (item) => (item.services || [])
        .map((s) => pickLocalized(s, "name", language))
        .filter(Boolean)
        .join(", ");

    const columns = [
        {
            key: "image",
            header: t("adminPanel.toursTable.headers.image"),
            className: "is-thumb",
            render: (item) => (
                <img className="adm-thumb adm-thumb--wide" src={TOUR_CARD_IMG + item.cardImage} alt="" loading="lazy" decoding="async" />
            ),
        },
        {
            key: "name",
            header: t("adminPanel.toursTable.headers.name"),
            render: (item) => <span className="adm-cell-title">{name(item)}</span>,
        },
        {
            key: "offer",
            header: t("adminPanel.toursTable.headers.offer"),
            render: (item) => <ExpandableText text={offers(item)} />,
        },
        {
            key: "description",
            header: t("adminPanel.toursTable.headers.description"),
            render: (item) => <ExpandableText text={pickLocalized(item, "description", language)} />,
        },
        {
            key: "actions",
            header: <span className="visually-hidden">{t("adminPanel.toursTable.headers.actions")}</span>,
            className: "is-actions",
            render: (item) => (
                <div className="adm-actions">
                    <IconButton icon={Pencil} label={at("edit")} to={`/admin/tours/edit/${item.id}`} variant="brand" />
                    <IconButton icon={Trash2} label={at("delete")} onClick={() => del.ask(item)} variant="danger" />
                </div>
            ),
        },
    ];

    return (
        <>
            <AdminDataTable
                columns={columns}
                rows={tours}
                loading={isLoading}
                searchText={(row) => `${name(row)} ${offers(row)}`}
            />
            <ConfirmDialog
                open={del.isOpen}
                title={t("adminPanel.toursTable.modal.title")}
                description={del.target ? `${name(del.target)} — ${at("deleteHint")}` : undefined}
                cancelLabel={t("adminPanel.toursTable.modal.cancel")}
                confirmLabel={t("adminPanel.toursTable.modal.confirm")}
                loadingLabel={t("adminPanel.toursTable.modal.deleting")}
                loading={isDeleting}
                onCancel={del.cancel}
                onConfirm={del.confirm}
            />
        </>
    );
}

export default ToursTableNew;
