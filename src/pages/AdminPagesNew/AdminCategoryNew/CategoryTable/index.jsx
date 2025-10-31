import './index.scss'
import Pagination from "../../../../components/UserComponents/Pagination/index.jsx";
import {useState} from "react";
import editIcon from '/src/assets/adminEditİcon.svg'
import delIcon from '/src/assets/adminDelİcon.svg'
import navIcon from '/src/assets/adminNavİcon.svg'
import closeIcon from '/src/assets/closeIcon.svg'
import cat1 from '/src/assets/Servis/cat1.svg'
import editIconModal from '/src/assets/editIconModal.svg'
import deleteImgModal from '/src/assets/deleteModalImg.png'
import {useNavigate} from "react-router-dom";
function CategoryTableNew() {
    const arr = [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
    ]
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const totalPages = Math.ceil(arr.length / itemsPerPage);
    const [activeIcon, setActiveIcon] = useState(null);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = arr.slice(startIndex, startIndex + itemsPerPage);
    const openEditModal = (item) => {
        setSelectedItem(item);
        setShowEditModal(true);
    };
    const navigate =useNavigate();
    const openDeleteModal = (item) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
    };

    const closeModal = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
        setSelectedItem(null);
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
                   {currentItems.map((item, index) => (
                       <div className="grid-row" key={index}>
                           <div>
                               <input type="checkbox" />
                           </div>
                           <div>
                               <div className="icon">
                                   {item.icon}
                               </div>
                           </div>
                           <div className="name">Xərçəng müalicəsi</div>
                           <div className="count">3</div>
                           <div className="actions">
                               <div className={'action edit'} onClick={() => openEditModal(item)}>
                                   <img src={editIcon} />
                               </div>
                               <div className={'action trash'} onClick={() => openDeleteModal(item)}>
                                   <img src={delIcon} />
                               </div>
                               <div className={'action navigate'} onClick={()=>navigate('/admin/category/add')}>
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
            {showEditModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Düzəliş et</h3>
                        <img src={closeIcon} className={'close-icon'} alt="" onClick={()=>closeModal()}/>
                        <div className={'edit-form'}>
                            <label>Kateqoriya adı</label>
                            <div className={'editInput'}>
                                <input type={'text'} placeholder={'Xərçəng müalicəsi'}/>
                                <img src={editIconModal} className={'editIconModal'}/>
                            </div>
                            <label>İcon</label>
                            <div className={'editCategory'}>
                                {arr.map((item, index) => (
                                    <div
                                        key={index}
                                         className={`iconDiv ${activeIcon === index ? 'active' : ''}`}
                                         onClick={() => setActiveIcon(index)} // 🔹 kliklə seç
                                    >
                                        <img src={cat1}/>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button className="submit-btn" onClick={closeModal}>Yadda saxla</button>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
                       <img src={deleteImgModal} className={'deleteImg'}/>
                        <h3>Kateqoriyanı silmək istədiyinizə əminsiz?</h3>
                        <div className="modal-actions">
                            <button className="cancel" onClick={closeModal}>Ləğv et</button>
                            <button className="confirm">Sil</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoryTableNew;