import './index.scss'
import Pagination from "../../../../components/UserComponents/Pagination/index.jsx";
import {useMemo, useState} from "react";
import editIcon from '/src/assets/adminEditİcon.svg'
import delIcon from '/src/assets/adminDelİcon.svg'
import deleteImgModal from '/src/assets/deleteModalImg.png'
import {useNavigate} from "react-router-dom";
import closeIcon from '/src/assets/accordionClose.svg'
import openIcon from '/src/assets/accordionOpen.svg'
import {useGetAllContactQuery} from "../../../../services/userApi.jsx";
import {useTranslation} from "react-i18next";

function ContactTableNew({language, filter}) {
    const { t } = useTranslation();
    const {data:getAllContact} = useGetAllContactQuery()
    const contacts = getAllContact?.data
    const filteredContacts = useMemo(() => {
        if (filter === "Ümumi") return contacts;
        if (filter === "Tur") return contacts.filter(c => c.tourId || c.tourName);
        if (filter === "Klinik") return contacts.filter(c => c.clinicId || c.clinicName);
        if (filter === "Xidmət") return contacts.filter(c => c.serviceId || c.serviceName);
        return contacts;
    }, [contacts, filter]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const totalPages = Math.ceil(filteredContacts?.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredContacts?.slice(startIndex, startIndex + itemsPerPage);
    const [openIndex, setOpenIndex] = useState(null);



    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    return (
        <div id={'contact-table'}>
            <div className={'contact-table-wrapper'}>
                <div className="grid-header">
                    <div></div>
                    <div>{t("adminPanel.contactTable.headers.name")}</div>
                    <div>{t("adminPanel.contactTable.headers.email")}</div>
                    <div>{t("adminPanel.contactTable.headers.note")}</div>
                    <div>{t("adminPanel.contactTable.headers.tourName")}</div>
                    <div>{t("adminPanel.contactTable.headers.phone")}</div>
                </div>

                <div className="grid-body">
                    {currentItems?.length > 0 ? (
                        currentItems?.map((item, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <div className="grid-row" key={item.id}>
                                    {/* Checkbox */}
                                    <div>
                                        <input type="checkbox"/>
                                    </div>

                                    {/* Ad Soyad */}
                                    <div>{item.name || "-"} {item.surname || ""}</div>

                                    {/* Email */}
                                    <div>{item.email || "-"}</div>

                                    {/* Qeyd */}
                                    <div className={`count ${isOpen ? "open" : ""}`}>
                                        <p>{item.description || "-"}</p>
                                        <button
                                            className="accordion-btn"
                                            onClick={() => toggleAccordion(index)}
                                        >
                                            <img src={isOpen ? openIcon : closeIcon}/>
                                        </button>
                                    </div>

                                    {/* Tur / Xidmət / Klinika adı */}
                                    <div>
                                        {item.tourName || item.serviceName || item.clinicName || "-"}
                                    </div>

                                    {/* Nömrə */}
                                    <div>{item.phoneNumber || "-"}</div>


                                </div>
                            );
                        })
                    ) : (
                        <div className="no-data">
                            <p>{t("adminPanel.contactTable.emptyMessage")}</p>
                        </div>
                    )}
                </div>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

        </div>
    );
}

export default ContactTableNew;