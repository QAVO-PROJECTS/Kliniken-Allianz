import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Trash2 } from "lucide-react";
import { useDeleteCarMutation, useGetAllCarQuery } from "../../../../../api/userApi.js";
import { CAR_CARD_IMAGES } from "../../../../../config/mediaUrls.js";
import AdminDataTable from "../../../../../components/admin/AdminDataTable/index.jsx";
import IconButton from "../../../../../components/admin/IconButton/index.jsx";
import ConfirmDialog from "../../../../../components/admin/ConfirmDialog/index.jsx";
import ExpandableText from "../../../../../components/admin/ExpandableText/index.jsx";
import { useDeleteConfirm } from "../../../../../components/admin/shared/useDeleteConfirm.js";
import { pickLocalized } from "../../../../../components/admin/shared/localize.js";
import { useAdminT } from "../../../../../components/admin/shared/adminStrings.js";

function CarTableNew({ language }) {
    const { t } = useTranslation();
    const at = useAdminT();
    const { data: getAllCars, isLoading, refetch } = useGetAllCarQuery();
    const cars = getAllCars?.data;
    const [deleteCar, { isLoading: isDeleting }] = useDeleteCarMutation();
    const del = useDeleteConfirm(deleteCar, {
        successMessage: t("adminPanel.carTable.toast.deleteSuccess"),
        errorMessage: t("adminPanel.carTable.toast.deleteError"),
        onSuccess: refetch,
    });

    useEffect(() => {
        refetch();
    }, [refetch]);

    const name = (item) => pickLocalized(item, "name", language);

    const columns = [
        {
            key: "image",
            header: t("adminPanel.carTable.headers.image"),
            className: "is-thumb",
            render: (item) => {
                const firstImage = item.cardImage || item.carImages?.[0];
                return firstImage ? (
                    <img className="adm-thumb adm-thumb--wide" src={CAR_CARD_IMAGES + firstImage} alt="" loading="lazy" decoding="async" />
                ) : (
                    <span className="adm-cell-muted">-</span>
                );
            },
        },
        {
            key: "name",
            header: t("adminPanel.carTable.headers.name"),
            render: (item) => <span className="adm-cell-title">{name(item)}</span>,
        },
        {
            key: "type",
            header: t("adminPanel.carTable.headers.type"),
            className: "is-nowrap",
            render: (item) => (item.type ? <span className="badge">{item.type}</span> : <span className="adm-cell-muted">-</span>),
        },
        {
            key: "price",
            header: t("adminPanel.carTable.headers.price"),
            className: "is-nowrap",
            render: (item) => (item.price ? <span>{item.price}</span> : <span className="adm-cell-muted">-</span>),
        },
        {
            key: "description",
            header: t("adminPanel.carTable.headers.description"),
            render: (item) => <ExpandableText text={pickLocalized(item, "description", language)} />,
        },
        {
            key: "actions",
            header: <span className="visually-hidden">{t("adminPanel.carTable.headers.actions")}</span>,
            className: "is-actions",
            render: (item) => (
                <div className="adm-actions">
                    <IconButton icon={Pencil} label={at("edit")} to={`/admin/car/edit/${item.id}`} variant="brand" />
                    <IconButton icon={Trash2} label={at("delete")} onClick={() => del.ask(item)} variant="danger" />
                </div>
            ),
        },
    ];

    return (
        <>
            <AdminDataTable
                columns={columns}
                rows={cars}
                loading={isLoading}
                searchText={(row) => `${name(row)} ${row.type ?? ""}`}
            />
            <ConfirmDialog
                open={del.isOpen}
                title={t("adminPanel.carTable.modal.confirmDelete")}
                description={del.target ? `${name(del.target)}: ${at("deleteHint")}` : undefined}
                cancelLabel={t("adminPanel.carTable.modal.cancel")}
                confirmLabel={t("adminPanel.carTable.modal.delete")}
                loadingLabel={t("adminPanel.carTable.modal.deleting")}
                loading={isDeleting}
                onCancel={del.cancel}
                onConfirm={del.confirm}
            />
        </>
    );
}

export default CarTableNew;
