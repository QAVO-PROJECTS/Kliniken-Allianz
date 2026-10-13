import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Star, Trash2 } from "lucide-react";
import { useDeleteOtelsMutation, useGetAllOtelsQuery } from "../../../../../api/userApi.js";
import { OTEL_CARD_IMAGES } from "../../../../../config/mediaUrls.js";
import AdminDataTable from "../../../../../components/admin/AdminDataTable/index.jsx";
import IconButton from "../../../../../components/admin/IconButton/index.jsx";
import ConfirmDialog from "../../../../../components/admin/ConfirmDialog/index.jsx";
import { useDeleteConfirm } from "../../../../../components/admin/shared/useDeleteConfirm.js";
import { pickLocalized } from "../../../../../components/admin/shared/localize.js";
import { useAdminT } from "../../../../../components/admin/shared/adminStrings.js";

function Stars({ value = 0 }) {
    const full = Math.round(Number(value) || 0);
    return (
        <span className="adm-stars" role="img" aria-label={`${value || 0} / 5`}>
            {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={15} strokeWidth={1.75} className={i < full ? "is-on" : ""} aria-hidden="true" />
            ))}
        </span>
    );
}

function OtelTableNew({ language }) {
    const { t } = useTranslation();
    const at = useAdminT();
    const { data: getAllOtels, isLoading, refetch } = useGetAllOtelsQuery();
    const otels = getAllOtels?.data;
    const [deleteOtel, { isLoading: isDeleting }] = useDeleteOtelsMutation();
    const del = useDeleteConfirm(deleteOtel, {
        successMessage: t("adminPanel.hotelTable.toast.deleteSuccess"),
        errorMessage: t("adminPanel.hotelTable.toast.deleteError"),
        onSuccess: refetch,
    });

    useEffect(() => {
        refetch();
    }, [refetch]);

    const name = (item) => pickLocalized(item, "name", language);

    const columns = [
        {
            key: "image",
            header: t("adminPanel.hotelTable.headers.image"),
            className: "is-thumb",
            render: (item) => (
                <img className="adm-thumb adm-thumb--wide" src={OTEL_CARD_IMAGES + item.cardImage} alt="" loading="lazy" decoding="async" />
            ),
        },
        {
            key: "name",
            header: t("adminPanel.hotelTable.headers.name"),
            render: (item) => <span className="adm-cell-title">{name(item)}</span>,
        },
        {
            key: "location",
            header: t("adminPanel.hotelTable.headers.location"),
            render: (item) => pickLocalized(item, "location", language) || <span className="adm-cell-muted">-</span>,
        },
        {
            key: "rating",
            header: t("adminPanel.hotelTable.headers.rating"),
            className: "is-nowrap",
            render: (item) => <Stars value={item.raiting} />,
        },
        {
            key: "actions",
            header: <span className="visually-hidden">{t("adminPanel.hotelTable.headers.actions")}</span>,
            className: "is-actions",
            render: (item) => (
                <div className="adm-actions">
                    <IconButton icon={Pencil} label={at("edit")} to={`/admin/otel/edit/${item.id}`} variant="brand" />
                    <IconButton icon={Trash2} label={at("delete")} onClick={() => del.ask(item)} variant="danger" />
                </div>
            ),
        },
    ];

    return (
        <>
            <AdminDataTable
                columns={columns}
                rows={otels}
                loading={isLoading}
                searchText={(item) => `${name(item)} ${pickLocalized(item, "location", language)}`}
            />
            <ConfirmDialog
                open={del.isOpen}
                title={t("adminPanel.hotelTable.modal.confirmDelete")}
                description={del.target ? `${name(del.target)}: ${at("deleteHint")}` : undefined}
                cancelLabel={t("adminPanel.hotelTable.modal.cancel")}
                confirmLabel={t("adminPanel.hotelTable.modal.delete")}
                loadingLabel={t("adminPanel.hotelTable.modal.deleting")}
                loading={isDeleting}
                onCancel={del.cancel}
                onConfirm={del.confirm}
            />
        </>
    );
}

export default OtelTableNew;
