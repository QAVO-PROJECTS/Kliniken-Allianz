import './index.scss'
import {NavLink, useNavigate, useParams} from "react-router-dom";
import rootIcon from '/src/assets/rootIcon.svg'
import rootIcongri from '/src/assets/adminNavİcon2.svg'
import aze from '/src/assets/azerbaijan.svg'
import rus from '/src/assets/russia.svg'
import usa from '/src/assets/unitedstates.svg'
import ger from '/src/assets/germany.svg'
import arb from '/src/assets/unitedarabemirates.svg'
import {useEffect, useState} from "react";
import {useGetAllClinicQuery, useGetServiceByIdQuery, usePutServiceMutation} from "../../../services/userApi.jsx";
import showToast from "../../../components/ToastMessage.js";

function CategoryServisEdit() {
    const [activeIcon, setActiveIcon] = useState([]); // array halında saxla
    const {id} = useParams();
    const {data:getServiceById,isLoading} = useGetServiceByIdQuery(id)
    const service = getServiceById?.data
    const {data:getAllClinic} = useGetAllClinicQuery()
    const clinics = getAllClinic?.data
    const [putService, { isLoading: isUpdating }] = usePutServiceMutation();
    const navigate = useNavigate()
    const [inputs, setInputs] = useState({
        az: "",
        ru: "",
        en: "",
    });

    const [descriptions, setDescriptions] = useState({
        az: "",
        ru: "",
        en: "",
    });

    const [selectedClinics, setSelectedClinics] = useState([]);
    const [initialClinics, setInitialClinics] = useState([]); // ilkin (backenddən gələn) klinikalar

    // 🔹 Backend datanı doldur
    useEffect(() => {
        if (service) {
            setInputs({
                az: service.name || "",
                ru: service.nameRu || "",
                en: service.nameEng || "",
            });
            setDescriptions({
                az: service.description || "",
                ru: service.descriptionRu || "",
                en: service.descriptionEng || "",
            });
            const clinicIds = service.clinics?.map(c => c.id) || [];
            setSelectedClinics(clinicIds);
            setInitialClinics(clinicIds);
        }
    }, [service]);

    // 🔹 Input dəyişiklikləri
    const handleInputChange = (lang, value) => {
        setInputs(prev => ({ ...prev, [lang]: value }));
    };

    const handleDescriptionChange = (lang, value) => {
        setDescriptions(prev => ({ ...prev, [lang]: value }));
    };

    // 🔹 Checkbox dəyişiklik
    const toggleClinic = (id) => {
        setSelectedClinics((prev) =>
            prev.includes(id)
                ? prev.filter((cid) => cid !== id)
                : [...prev, id]
        );
    };

    // 🔹 PUT funksiyası
    const handleSubmit = async () => {
        if (!inputs.az.trim()) {
            showToast("Azərbaycan dilində xidmət adı boş ola bilməz!", 'warning');
            return;
        }

        if (!service?.categoryId) {
            showToast("Kateqoriya ID tapılmadı!", 'error');
            return;
        }

        try {
            const formData = new FormData();
            formData.append("id", id);
            formData.append("name", inputs.az);
            formData.append("nameRu", inputs.ru);
            formData.append("nameEng", inputs.en);
            formData.append("description", descriptions.az);
            formData.append("descriptionRu", descriptions.ru);
            formData.append("descriptionEng", descriptions.en);
            formData.append("categoryId", service.categoryId);

            // 🔹 clinicServices → əlavə olunanlar
            selectedClinics.forEach((clinicId) => {
                formData.append("clinicServices", clinicId);
            });

            // 🔹 deleteClinicServices → çıxarılanlar
            const removedClinics = initialClinics.filter(
                (id) => !selectedClinics.includes(id)
            );
            removedClinics.forEach((clinicId) => {
                formData.append("deleteClinicServices", clinicId);
            });

            await putService(formData).unwrap();
            showToast("Xidmət uğurla yeniləndi ✅", 'success');
            navigate(`/admin/category/servis/${service.categoryId}`);
        } catch (err) {
            console.error("PUT error:", err);
            showToast("Xidmət yenilənərkən xəta baş verdi ❌", 'error');
        }
    };

    if (isLoading) return <p>Yüklənir...</p>;
    return (
        <div id={'category-servis-edit'}>
            <div className={'category-servis-edit'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/category">Kateqoriya</NavLink>
                        <img src={rootIcongri} alt=""/>
                        <NavLink className="link"  to={`/admin/category/servis/${service?.categoryId}`}>{service?.name || "Xidmət"}</NavLink>
                        <img src={rootIcon} alt=""/>
                        Düzəliş et
                    </h2>
                </div>
                <div className={'category-servis-edit-head'}>
                    <h1>Xidmətə düzəliş et</h1>
                    <p>Buradan xidmətləri idarə edə və düzəliş edə <bilərsiz className=""></bilərsiz></p>
                </div>
                <div className={'category-servis-edit-main'}>
                    <div className={'category-servis-edit-data'}>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>Xidmət adı</h3>
                                <p>Xidmətin sistemdə görünəcək adını daxil edin.</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            value={inputs.az}
                                            onChange={(e) => handleInputChange("az", e.target.value)}
                                            placeholder={'Travmatologiya'}
                                        />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={aze} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            value={inputs.ru}
                                            onChange={(e) => handleInputChange("ru", e.target.value)}
                                            placeholder={'Травматология'}
                                        />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={rus} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            value={inputs.en}
                                            onChange={(e) => handleInputChange("en", e.target.value)}
                                            placeholder={'Traumatology'}
                                        />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={usa} alt="" />
                                    </div>
                                </div>
                                {/*<div className={'add-data'}>*/}
                                {/*    <div className={'add-input'}>*/}
                                {/*        <input placeholder={'Travmatologiya'}/>*/}
                                {/*    </div>*/}
                                {/*    <div className={'langCountry'}>*/}
                                {/*        <img src={ger} alt=""/>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {/*<div className={'add-data'}>*/}
                                {/*    <div className={'add-input'}>*/}
                                {/*        <input placeholder={'Travmatologiya'}/>*/}
                                {/*    </div>*/}
                                {/*    <div className={'langCountry'}>*/}
                                {/*        <img src={arb} alt=""/>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                        <div className={"dataDiv images"}>
                            <div className={'header'}>
                                <h3>Klinika</h3>
                                <p>Xidmətin əlaqəli olduğu klinikanı seçin.</p>
                            </div>
                            <div className={'addCategory'}>
                                {clinics?.map((item) => (
                                    <label key={item.id} className="checkboxItem">
                                        <input
                                            type="checkbox"
                                            checked={selectedClinics.includes(item.id)}
                                            onChange={() => toggleClinic(item.id)}
                                        />
                                        <span>{item.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={'category-servis-desc'}>
                        <div className={'header'}>
                            <h3>Təsvir</h3>
                            <p>Xidmətin qısa təsvirini yazın.</p>
                        </div>
                        <div className={'category-servis-desc-data'}>
                            <div className={'category-servis-desc-texts'}>
                                <textarea
                                    value={descriptions.az}
                                    onChange={(e) => handleDescriptionChange("az", e.target.value)}
                                    placeholder={'Təsvir əlavə edin...'}
                                />
                                <div className={'langCountry'}>
                                    <img src={aze} alt="" />
                                </div>
                            </div>
                            <div className={'category-servis-desc-texts'}>
                                <textarea
                                    value={descriptions.ru}
                                    onChange={(e) => handleDescriptionChange("ru", e.target.value)}
                                    placeholder={'Добавьте описание...'}
                                />
                                <div className={'langCountry'}>
                                    <img src={rus} alt="" />
                                </div>
                            </div>
                            <div className={'category-servis-desc-texts'}>
                                <textarea
                                    value={descriptions.en}
                                    onChange={(e) => handleDescriptionChange("en", e.target.value)}
                                    placeholder={'Add description...'}
                                />
                                <div className={'langCountry'}>
                                    <img src={usa} alt="" />
                                </div>
                            </div>
                            {/*<div className={'category-servis-desc-texts'}>*/}
                            {/*    <textarea  placeholder={'Təsvir əlavə edin...'}/>*/}
                            {/*    <div className={'langCountry'}>*/}
                            {/*        <img src={ger} alt=""/>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            {/*<div className={'category-servis-desc-texts'}>*/}
                            {/*    <textarea  placeholder={'Təsvir əlavə edin...'}/>*/}
                            {/*    <div className={'langCountry'}>*/}
                            {/*        <img src={arb} alt=""/>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                    <button onClick={handleSubmit} disabled={isUpdating}>
                        {isUpdating ? "Yenilənir..." : "Yadda saxla"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CategoryServisEdit;