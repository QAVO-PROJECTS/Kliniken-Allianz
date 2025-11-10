import './index.scss'
import Pagination from "../../../../components/UserComponents/Pagination/index.jsx";
import {useEffect, useState} from "react";
import editIcon from '/src/assets/adminEditİcon.svg'
import delIcon from '/src/assets/adminDelİcon.svg'
import deleteImgModal from '/src/assets/deleteModalImg.png'
import {useNavigate} from "react-router-dom";
import closeIcon from '/src/assets/accordionClose.svg'
import openIcon from '/src/assets/accordionOpen.svg'
import {useDeleteDoctorsMutation, useGetAllDoctorsQuery} from "../../../../services/userApi.jsx";
import {DOCTOR_IMG_URL} from "../../../../contants.js";
import showToast from "../../../../components/ToastMessage.js";

function DoctorTableNew({language}) {
    const {data: getAllDoctors, refetch, isFetching} = useGetAllDoctorsQuery();
    const doctors = getAllDoctors?.data || [];

    const [deleteDoctor, {isLoading: isDeleting}] = useDeleteDoctorsMutation();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const totalPages = Math.ceil(doctors.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = doctors.slice(startIndex, startIndex + itemsPerPage);

    const [openIndex, setOpenIndex] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        refetch();
    }, [refetch]);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // 🔹 Modal aç
    const openDeleteModal = (doctor) => {
        setSelectedDoctor(doctor);
        setShowDeleteModal(true);
    };

    // 🔹 Modal bağla
    const closeModal = () => {
        setShowDeleteModal(false);
        setSelectedDoctor(null);
    };

    // 🔹 Delete funksiyası
    const handleDelete = async () => {
        if (!selectedDoctor) return;
        try {
            await deleteDoctor(selectedDoctor.id).unwrap();
            showToast("Həkim uğurla silindi ✅", "success");
            closeModal();
            refetch();
        } catch (err) {
            console.error(err);
            showToast("Silinmə zamanı xəta baş verdi ❌", "error");
        }
    };
    // 🔹 Ad (doctor name)
    const getLocalizedName = (item) => {
        switch (language) {
            case "EN":
                return item.nameEng && item.nameEng.trim() !== "" ? item.nameEng : item.name;
            case "RU":
                return item.nameRu && item.nameRu.trim() !== "" ? item.nameRu : item.name;
            case "DE":
                return item.nameAlm && item.nameAlm.trim() !== "" ? item.nameAlm : item.name;
            case "AR":
                return item.nameArab && item.nameArab.trim() !== "" ? item.nameArab : item.name;
            default:
                return item.name;
        }
    };

    // 🔹 Soyad (surname)
    const getLocalizedSurname = (item) => {
        switch (language) {
            case "EN":
                return item.surNameEng && item.surNameEng.trim() !== "" ? item.surNameEng : item.surName;
            case "RU":
                return item.surNameRu && item.surNameRu.trim() !== "" ? item.surNameRu : item.surName;
            case "DE":
                return item.surNameAlm && item.surNameAlm.trim() !== "" ? item.surNameAlm : item.surName;
            case "AR":
                return item.surNameArab && item.surNameArab.trim() !== "" ? item.surNameArab : item.surName;
            default:
                return item.surName;
        }
    };

    // 🔹 Vəzifə (role)
    const getLocalizedRole = (item) => {
        switch (language) {
            case "EN":
                return item.roleEng && item.roleEng.trim() !== "" ? item.roleEng : item.role;
            case "RU":
                return item.roleRu && item.roleRu.trim() !== "" ? item.roleRu : item.role;
            case "DE":
                return item.roleAlm && item.roleAlm.trim() !== "" ? item.roleAlm : item.role;
            case "AR":
                return item.roleArab && item.roleArab.trim() !== "" ? item.roleArab : item.role;
            default:
                return item.role;
        }
    };
    return (
        <div id="doctor-table">
            <div className="doctor-table-wrapper">
                <div className="grid-header">
                    <div></div>
                    <div>Şəkil</div>
                    <div>Adı</div>
                    <div>Soyadı</div>
                    <div>Vəzifə</div>
                    <div style={{textAlign: "center"}}>Təcrübə</div>
                    <div>Təsvir</div>
                    <div>Fəaliyyətlər</div>
                </div>

                <div className="grid-body">
                    {isFetching ? (
                        <div className="loading">Yüklənir...</div>
                    ) : currentItems.length === 0 ? (
                        <div className="no-data">Həkim tapılmadı</div>
                    ) : (
                        currentItems.map((item, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <div className="grid-row" key={item.id}>
                                    <div>
                                        <input type="checkbox" />
                                    </div>
                                    <div className="icon">
                                        <img
                                            src={DOCTOR_IMG_URL + item.doctorImage}
                                            alt="doctor"
                                            className="doctor-img"
                                        />
                                    </div>
                                    <div>{getLocalizedName(item)}</div>
                                    <div>{getLocalizedSurname(item)}</div>
                                    <div>{getLocalizedRole(item) || "-"}</div>
                                    <div style={{textAlign: "center"}}>{item.experience}</div>

                                    {/* --- Klinikalar --- */}
                                    <div className={`count ${isOpen ? "open" : ""}`}>
                                        <p>
                                            {item.clinics?.length > 0
                                                ? item.clinics.map((c) => c.name).join(", ")
                                                : "Təyin olunmayıb"}
                                        </p>
                                        <button
                                            className="accordion-btn"
                                            onClick={() => toggleAccordion(index)}
                                        >
                                            <img src={isOpen ? openIcon : closeIcon} />
                                        </button>
                                    </div>

                                    {/* --- Actions --- */}
                                    <div className="actions">
                                        <div
                                            className="action edit"
                                            onClick={() => navigate(`/admin/doctors/edit/${item.id}`)}
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
                    )}
                </div>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {/* --- Delete Modal --- */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div
                        className="delete-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img src={deleteImgModal} className="deleteImg" />
                        <h3>
                            {selectedDoctor
                                ? `${selectedDoctor.name} adlı həkimi silmək istədiyinizə əminsiniz?`
                                : "Həkimi silmək istədiyinizə əminsiniz?"}
                        </h3>
                        <div className="modal-actions">
                            <button className="cancel" onClick={closeModal}>
                                Ləğv et
                            </button>
                            <button
                                className="confirm"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Silinir..." : "Sil"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DoctorTableNew;
