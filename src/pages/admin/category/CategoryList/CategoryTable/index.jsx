import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ListTree, Pencil, Trash2 } from "lucide-react";
import { useDeleteCategoryMutation, useGetAllCategoryQuery } from "../../../../../api/userApi.js";
import { CATEGORY_IMAGES } from "../../../../../config/mediaUrls.js";
import AdminDataTable from "../../../../../components/admin/AdminDataTable/index.jsx";
import IconButton from "../../../../../components/admin/IconButton/index.jsx";
import ConfirmDialog from "../../../../../components/admin/ConfirmDialog/index.jsx";
import { useDeleteConfirm } from "../../../../../components/admin/shared/useDeleteConfirm.js";
import { pickLocalized } from "../../../../../components/admin/shared/localize.js";
import { useAdminT } from "../../../../../components/admin/shared/adminStrings.js";

function CategoryTableNew({ language }) {
    const { t } = useTranslation();
    const at = useAdminT();
    const { data: getAllCategory, isLoading, refetch } = useGetAllCategoryQuery();
    const categories = getAllCategory?.data;
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
    const del = useDeleteConfirm(deleteCategory, {
        successMessage: t("adminPanel.categoryTable.deleteSuccess"),
        errorMessage: t("adminPanel.categoryTable.deleteError"),
        onSuccess: refetch,
    });

    useEffect(() => {
        refetch();
    }, [refetch]);

    const name = (item) => pickLocalized(item, "name", language);

    const columns = [
        {
            key: "icon",
            header: t("adminPanel.categoryTable.icon"),
            className: "is-thumb",
            render: (item) => (
                <img className="adm-thumb adm-thumb--icon" src={CATEGORY_IMAGES + item.categoryImage} alt="" loading="lazy" decoding="async" />
            ),
        },
        {
            key: "name",
            header: t("adminPanel.categoryTable.name"),
            render: (item) => <span className="adm-cell-title">{name(item)}</span>,
        },
        {
            key: "count",
            header: t("adminPanel.categoryTable.serviceCount"),
            className: "is-num",
            render: (item) => <span className="badge">{item.services?.length ?? 0}</span>,
        },
        {
            key: "actions",
            header: <span className="visually-hidden">{t("adminPanel.categoryTable.actions")}</span>,
            className: "is-actions",
            render: (item) => (
                <div className="adm-actions">
                    <IconButton icon={ListTree} label={at("services")} to={`/admin/category/servis/${item.id}`} variant="brand" />
                    <IconButton icon={Pencil} label={at("edit")} to={`/admin/category/edit/${item.id}`} variant="brand" />
                    <IconButton icon={Trash2} label={at("delete")} onClick={() => del.ask(item)} variant="danger" />
                </div>
            ),
        },
    ];

    return (
        <>
            <AdminDataTable
                columns={columns}
                rows={categories}
                loading={isLoading}
                searchText={name}
            />
            <ConfirmDialog
                open={del.isOpen}
                title={t("adminPanel.categoryTable.deleteConfirmTitle")}
                description={del.target ? `${name(del.target)}: ${at("deleteHint")}` : undefined}
                cancelLabel={t("adminPanel.categoryTable.cancel")}
                confirmLabel={t("adminPanel.categoryTable.delete")}
                loadingLabel={t("adminPanel.categoryTable.deleting")}
                loading={isDeleting}
                onCancel={del.cancel}
                onConfirm={del.confirm}
            />
        </>
    );
}

export default CategoryTableNew;
