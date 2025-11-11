import './index.scss'
import Pagination from "../../../../components/UserComponents/Pagination/index.jsx";
import {useEffect, useState} from "react";
import editIcon from '/src/assets/adminEditİcon.svg'
import delIcon from '/src/assets/adminDelİcon.svg'
import deleteImgModal from '/src/assets/deleteModalImg.png'
import {useNavigate, useParams} from "react-router-dom";
import closeIcon from '/src/assets/accordionClose.svg'
import openIcon from '/src/assets/accordionOpen.svg'
import {
    useDeleteServiceMutation,
    useGetCategoryByIdQuery,
     useLazyGetServiceByIdQuery
} from "../../../../services/userApi.jsx";
import showToast from "../../../../components/ToastMessage.js";
import {useTranslation} from "react-i18next";
function CategoryTableServisNew({language}) {
    const { t } = useTranslation();
    const {id} = useParams();
    const {data:getCategoryById, isLoading ,refetch} = useGetCategoryByIdQuery(id)
    const category = getCategoryById?.data
    const services = category?.services || [];
    // Lazy query (elle tetikleme)
    const [fetchServiceById] = useLazyGetServiceByIdQuery();
    const [servicesWithClinics, setServicesWithClinics] = useState([])
    useEffect(() => {
        const fetchAllServices = async () => {
            if (!services.length) return;

            const results = await Promise.all(
                services.map(async (srv) => {
                    console.log(srv.id)
                    try {
                        const { data } = await fetchServiceById(srv.id).unwrap();
                        console.log(data)
                        return {
                            ...srv,
                            clinics: data.clinics,
                        };
                    } catch (e) {
                        console.error("Xidmət məlumatı alınmadı:", e);
                        return { ...srv, clinics: [] };
                    }
                })
            );

            setServicesWithClinics(results);
        };

        fetchAllServices();
    }, [services]);
    const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation()
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const totalPages = Math.ceil(servicesWithClinics.length / itemsPerPage);
    console.log("servicesWithClinics", servicesWithClinics);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = servicesWithClinics.slice(startIndex, startIndex + itemsPerPage);
    const [openIndex, setOpenIndex] = useState(null);
    useEffect(() => {
        refetch()
    }, []);
    const navigate =useNavigate();
    const openDeleteModal = (item) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
    };

    const closeModal = () => {
        setSelectedItem(null);
        setShowDeleteModal(false);

    };
    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);

    };
    const getLocalizedName = (item) => {
        switch (language) {
            case "EN": return item.nameEng || item.name;
            case "RU": return item.nameRu || item.name;
            case "DE": return item.nameAlm || item.name;
            case "AR": return item.nameArab || item.name;
            default: return item.name;
        }
    };

    const getLocalizedDescription = (item) => {
        switch (language) {
            case "EN": return item.descriptionEng || item.description;
            case "RU": return item.descriptionRu || item.description;
            case "DE": return item.descriptionAlm || item.description;
            case "AR": return item.descriptionArab || item.description;
            default: return item.description;
        }
    };
    const handleDelete = async () => {
        if (!selectedItem?.id) {
            showToast(t("adminPanel.categoryServiceTable.toast.notFound"), "error");
            return;
        }

        try {
            await deleteService(selectedItem.id).unwrap();
            showToast(t("adminPanel.categoryServiceTable.toast.success"), "success");
            closeModal();
            refetch();
        } catch (err) {
            console.error("Silinmə xətası:", err);
            showToast(t("adminPanel.categoryServiceTable.toast.error"), "error");
        }
    };
    const getLocalizedClinicName = (clinic) => {
        switch (language) {
            case "EN": return clinic.nameEng || clinic.name;
            case "RU": return clinic.nameRu || clinic.name;
            case "DE": return clinic.nameAlm || clinic.name;
            case "AR": return clinic.nameArab || clinic.name;
            default: return clinic.name;
        }
    };

    if (isLoading) return <p>{t("adminPanel.categoryServiceTable.loading")}</p>;
    return (
        <div id={'category-servis-table'}>
           <div className={'category-servis-table-wrapper'}>
               <div className="grid-header">
                   <div></div>
                   <div>{t("adminPanel.categoryServiceTable.name")}</div>
                   <div>{t("adminPanel.categoryServiceTable.description")}</div>
                   <div>{t("adminPanel.categoryServiceTable.clinics")}</div>
                   <div>{t("adminPanel.categoryServiceTable.actions")}</div>
               </div>

               <div className="grid-body">
                   {currentItems.length > 0 ? (
                       currentItems.map((item, index) => {
                           const isOpen = openIndex === index;
                           return (
                               <div className="grid-row" key={item.id}>
                                   {/* Checkbox */}
                                   <div>
                                       <input type="checkbox" />
                                   </div>

                                   {/* Xidmət adı */}
                                   <div>{getLocalizedName(item)}</div>

                                   {/* Təsvir */}
                                   <div className={`name ${isOpen ? "open" : ""}`}>
                                       <p>{getLocalizedDescription(item)}</p>
                                       <button
                                           className="accordion-btn"
                                           onClick={() => toggleAccordion(index)}
                                       >
                                           <img src={isOpen ? openIcon : closeIcon} />
                                       </button>
                                   </div>

                                   {/* Klinikalar */}
                                   <div className={`count ${isOpen ? "open" : ""}`}>
                                       {item.clinics?.length > 0 ? (
                                           <p>{item.clinics.map(c => getLocalizedClinicName(c)).join(", ")}</p>
                                       ) : (
                                           <p>-</p>
                                       )}
                                       <button
                                           className="accordion-btn"
                                           onClick={() => toggleAccordion(index)}
                                       >
                                           <img src={isOpen ? openIcon : closeIcon} />
                                       </button>
                                   </div>

                                   {/* Actions */}
                                   <div className="actions">
                                       <div
                                           className="action edit"
                                           onClick={() => navigate(`/admin/category/servis/edit/${item.id}`)}
                                       >
                                           <img src={editIcon} />
                                       </div>
                                       <div
                                           className="action trash"
                                           onClick={() => openDeleteModal(item)}
                                       >
                                           <img src={delIcon} />
                                       </div>
                                   </div>
                               </div>
                           );
                       })
                   ) : (
                       <div className="no-data">
                           <p>{t("adminPanel.categoryServiceTable.noData")}</p>
                       </div>
                   )}
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
                        <h3>{t("adminPanel.categoryServiceTable.deleteConfirmTitle")}</h3>
                        <div className="modal-actions">
                            <button className="cancel" onClick={closeModal}>{t("adminPanel.categoryServiceTable.cancel")}</button>
                            <button className="confirm" onClick={handleDelete} disabled={isDeleting}>
                                {isDeleting
                                    ? t("adminPanel.categoryServiceTable.deleting")
                                    : t("adminPanel.categoryServiceTable.delete")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoryTableServisNew;