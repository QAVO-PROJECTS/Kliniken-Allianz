import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

/** Primary "Create new" button for list page headers. */
function AddBtn({ nav, label }) {
    const { t } = useTranslation();
    return (
        <Link to={nav} className="btn btn--primary">
            <Plus size={18} strokeWidth={2} aria-hidden="true" />
            {label || t("adminPanel.addBtn.text")}
        </Link>
    );
}

export default AddBtn;
