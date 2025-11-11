import './index.scss'
import Pagination from "../../../../components/UserComponents/Pagination/index.jsx";
import {useEffect, useState} from "react";
import editIcon from '/src/assets/adminEditİcon.svg'
import delIcon from '/src/assets/adminDelİcon.svg'
import deleteImgModal from '/src/assets/deleteModalImg.png'
import {useNavigate} from "react-router-dom";
import closeIcon from '/src/assets/accordionClose.svg'
import openIcon from '/src/assets/accordionOpen.svg'
import {useDeleteClinicMutation, useGetAllClinicQuery} from "../../../../services/userApi.jsx";
import {CLINIC_CARD_IMAGES} from "../../../../contants.js";
import showToast from "../../../../components/ToastMessage.js";
import {useTranslation} from "react-i18next";
function ClinicTableNew({language}) {
    const { t } = useTranslation();
    const {data:getAllClinic,refetch} = useGetAllClinicQuery()
    const clinics = getAllClinic?.data
    const [deleteClinic, { isLoading: isDeleting }] = useDeleteClinicMutation();    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const totalPages = Math.ceil(clinics?.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = clinics?.slice(startIndex, startIndex + itemsPerPage);
    const [openIndex, setOpenIndex] = useState(null);
    const navigate =useNavigate();
    const openDeleteModal = (item) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
    };
    useEffect(() => {
        refetch()
    }, []);
    const closeModal = () => {
        setShowDeleteModal(false);
        setSelectedItem(null);
    };
    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    const getLocalizedName = (item) => {
        switch (language) {
            case "EN": return item.nameEng?.trim() ? item.nameEng : item.name;
            case "RU": return item.nameRu?.trim() ? item.nameRu : item.name;
            case "DE": return item.nameAlm?.trim() ? item.nameAlm : item.name;
            case "AR": return item.nameArab?.trim() ? item.nameArab : item.name;
            default: return item.name;
        }
    };

    const getLocalizedDescription = (item) => {
        switch (language) {
            case "EN": return item.descriptionEng?.trim() ? item.descriptionEng : item.description;
            case "RU": return item.descriptionRu?.trim() ? item.descriptionRu : item.description;
            case "DE": return item.descriptionAlm?.trim() ? item.descriptionAlm : item.description;
            case "AR": return item.descriptionArab?.trim() ? item.descriptionArab : item.description;
            default: return item.description;
        }
    };
    const handleDelete = async () => {
        if (!selectedItem) return;

        try {
            await deleteClinic(selectedItem.id).unwrap();
            closeModal();
            refetch();
            showToast(t("adminPanel.clinicTable.toast.deleteSuccess"), 'success');
        } catch (err) {
            console.error("Silinmə xətası:", err);
            showToast(t("adminPanel.clinicTable.toast.deleteError"), 'error');
        }
    };
    return (
        <div id={'clinic-table'}>
           <div className={'clinic-table-wrapper'}>
               <div className="grid-header">
                   <div></div>
                   <div>{t("adminPanel.clinicTable.image")}</div>
                   <div>{t("adminPanel.clinicTable.name")}</div>
                   <div>{t("adminPanel.clinicTable.description")}</div>
                   <div>{t("adminPanel.clinicTable.actions")}</div>
               </div>

               <div className="grid-body">
                   {currentItems?.map((item, index) => {
                       const isOpen = openIndex === index; // true/false
                       return (
                           <div className="grid-row" key={index}>
                               <div>
                                   <input type="checkbox" />
                               </div>
                               <div className="icon">
                                   <img
                                       src={CLINIC_CARD_IMAGES + item.clinicCardImage}
                                       alt={getLocalizedName(item)}
                                   />
                               </div>
                               <div>{getLocalizedName(item)}</div>
                               {/* --- Klinikalar --- */}
                               <div className={`count ${isOpen ? "open" : ""}`}>
                                   <p>{getLocalizedDescription(item) || "-"}</p>
                                   <button
                                       className="accordion-btn"
                                       onClick={() => toggleAccordion(index)}
                                   >
                                       <img src={isOpen ? openIcon : closeIcon} alt="toggle" />
                                   </button>
                               </div>

                               {/* --- Actions --- */}
                               <div className="actions">
                                   <div className="action edit" onClick={() => navigate(`/admin/clinic/edit/${item.id}`)}>
                                       <img src={editIcon} />
                                   </div>
                                   <div className="action trash" onClick={() => openDeleteModal(item)}>
                                       <img src={delIcon} />
                                   </div>
                               </div>
                           </div>
                       );
                   })}
               </div>
           </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
                       <img src={deleteImgModal} className={'deleteImg'}/>
                        <h3>{t("adminPanel.clinicTable.deleteConfirmTitle")}</h3>
                        <div className="modal-actions">
                            <button className="cancel" onClick={closeModal}> {t("adminPanel.clinicTable.cancel")}</button>
                            <button
                                className="confirm"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting
                                    ? t("adminPanel.clinicTable.deleting")
                                    : t("adminPanel.clinicTable.delete")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ClinicTableNew;