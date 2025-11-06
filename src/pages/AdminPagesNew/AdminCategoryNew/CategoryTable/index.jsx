import './index.scss'
import Pagination from "../../../../components/UserComponents/Pagination/index.jsx";
import {useEffect, useState} from "react";
import editIcon from '/src/assets/adminEditİcon.svg'
import delIcon from '/src/assets/adminDelİcon.svg'
import navIcon from '/src/assets/adminNavİcon.svg'
import closeIcon from '/src/assets/closeIcon.svg'
import cat1 from '/src/assets/Servis/cat1.svg'
import editIconModal from '/src/assets/editIconModal.svg'
import deleteImgModal from '/src/assets/deleteModalImg.png'
import {useNavigate} from "react-router-dom";
import {
    useDeleteCategoryMutation,
    useGetAllCategoryQuery,
    usePutCategoryMutation
} from "../../../../services/userApi.jsx";
import {CATEGORY_IMAGES} from "../../../../contants.js";
import showToast from "../../../../components/ToastMessage.js";
function CategoryTableNew({ language }) {
    const {data:getAllCategory,refetch} = useGetAllCategoryQuery()
    const categories = getAllCategory?.data
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation()

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const totalPages = Math.ceil(categories?.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = categories?.slice(startIndex, startIndex + itemsPerPage);
    const openEditModal = (item) => {
        setSelectedItem(item);

    };
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
    const getLocalizedName = (item) => {
        switch (language) {
            case "EN": return item.nameEng || item.name;
            case "RU": return item.nameRu || item.name;
            case "DE": return item.nameAlm || item.name;
            case "AR": return item.nameArab || item.name;
            default: return item.name;
        }
    };
    const handleDelete = async () => {
        try {
            await deleteCategory(selectedItem.id).unwrap();
            showToast("Kateqoriya uğurla silindi ✅", "success");
            closeModal();
            refetch();
        } catch (err) {
            console.error("Silinmə xətası:", err);
            showToast("Kateqoriyanı silmək mümkün olmadı ❌", "error");
        }
    };
    return (
        <div id={'category-table'}>
           <div className={'category-table-wrapper'}>
               <div className="grid-header">
                   <div></div>
                   <div>İcon</div>
                   <div>Adı</div>
                   <div style={{
                       textAlign: 'center',
                   }}>Xidmət sayı</div>
                   <div>Fəaliyyətlər</div>
               </div>

               <div className="grid-body">
                   {currentItems?.map((item, index) => (
                       <div className="grid-row" key={index}>
                           <div>
                               <input type="checkbox" />
                           </div>
                           <div>
                               <div className="icon">
                                   <img src={CATEGORY_IMAGES + item.categoryImage}/>
                               </div>
                           </div>
                           <div className="name">{getLocalizedName(item)}</div>
                           <div className="count">{item.services?.length}</div>
                           <div className="actions">
                               <div className={'action edit'} onClick={() => navigate(`/admin/category/edit/${item.id}`)}>
                                   <img src={editIcon} />
                               </div>
                               <div className={'action trash'} onClick={() => openDeleteModal(item)}>
                                   <img src={delIcon} />
                               </div>
                               <div className={'action navigate'} onClick={()=>navigate(`/admin/category/servis/${item.id}`)}>
                                   <img src={navIcon} />
                               </div>
                           </div>
                       </div>
                   ))}
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
                        <h3>Kateqoriyanı silmək istədiyinizə əminsiz?</h3>
                        <div className="modal-actions">
                            <button className="cancel" onClick={closeModal}>Ləğv et</button>
                            <button className="confirm" onClick={handleDelete} disabled={isDeleting}>
                                {isDeleting ? "Silinir..." : "Sil"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoryTableNew;