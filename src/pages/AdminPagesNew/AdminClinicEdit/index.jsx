import './index.scss'
import {NavLink} from "react-router-dom";
import rootIcon from '/src/assets/rootIcon.svg'
import aze from '/src/assets/azerbaijan.svg'
import rus from '/src/assets/russia.svg'
import usa from '/src/assets/unitedstates.svg'
import ger from '/src/assets/germany.svg'
import arb from '/src/assets/unitedarabemirates.svg'
import uploadIcon from '/src/assets/uploadIcon.svg'
import {useState} from "react";
import openIcon from '/src/assets/accordionOpen.svg'
import closeIcon from '/src/assets/accordionClose.svg'
function ClinicEdit() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [activeIcon, setActiveIcon] = useState([]);

    // 🔹 Ayrı state-lər
    const [sertifikatFiles, setSertifikatFiles] = useState([]);
    const [sertifikatOpen, setSertifikatOpen] = useState(false);

    const [galereyaFiles, setGalereyaFiles] = useState([]);
    const [galereyaOpen, setGalereyaOpen] = useState(false);

    // 🔹 Sertifikat yükləmə funksiyası
    const handleSertifikatChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const withPreview = newFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setSertifikatFiles((prev) => [...prev, ...withPreview]);
    };

    // 🔹 Galereya yükləmə funksiyası
    const handleGalereyaChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const withPreview = newFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setGalereyaFiles((prev) => [...prev, ...withPreview]);
    };

    // 🔹 Silmə funksiyaları
    const removeSertifikat = (index) => {
        setSertifikatFiles((prev) => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    const removeGalereya = (index) => {
        setGalereyaFiles((prev) => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    const arr = Array(10).fill({});
    return (
        <div id={'clinic-edit'}>
            <div className={'clinic-edit'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/clinic">Klinika</NavLink>
                        <img src={rootIcon} alt="" />
                        Klinikaya düzəliş edin
                    </h2>
                </div>
                <div className={'clinic-edit-head'}>
                    <h1>Klinikaya düzəliş edin</h1>
                    <p>Buradan klinikaları idarə edə və düzəliş edə bilərsiniz.</p>
                </div>
                <div className={'clinic-edit-main'}>
                    <div className={'clinic-edit-data'}>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>Klinika adı</h3>
                                <p>Xidmətin sistemdə görünəcək adını daxil edin.</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={'Travmatologiya'}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={aze} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={'Travmatologiya'}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={rus} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={'Travmatologiya'}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={usa} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={'Travmatologiya'}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={ger} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={'Travmatologiya'}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={arb} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="dataDiv images">
                            <div className="header">
                                <h3>Klinika şəkil</h3>
                                <p>Klinikanı təmsil edəcək şəkil yükləyin.</p>
                            </div>
                            <div
                                className={`uploadBox ${isDragging ? "dragging" : ""}`}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                            >
                                <input
                                    type="file"
                                    id="clinicImage"
                                    accept="image/*"
                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                    style={{ display: "none" }}
                                />
                                <label htmlFor="clinicImage" className="uploadArea">
                                    <img src={uploadIcon} alt="upload" />
                                    <p>Faylı yükləmək üçün bu sahəyə klikləyin və ya sürükləyin</p>
                                </label>
                            </div>

                            {selectedFile && (
                                <div className="uploadedFile">
                                    <div className="fileInfo">
                                        <img
                                            src={URL.createObjectURL(selectedFile)}
                                            alt="preview"
                                            className="previewImg"
                                        />
                                        <span>{selectedFile.name}</span>
                                    </div>
                                    <button onClick={() => setSelectedFile(null)}>✕</button>
                                </div>
                            )}
                        </div>


                    </div>
                    <div className={'tours-desc'}>
                        <div className={'header'}>
                            <h3>Təsvir</h3>
                            <p>Paketin qısa təsvirini yazın.</p>
                        </div>
                        <div className={'tours-desc-data'}>
                            <div className={'tours-desc-texts'}>
                                <textarea placeholder={'Təsvir əlavə edin...'}/>
                                <div className={'langCountry'}>
                                    <img src={aze} alt=""/>
                                </div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea  placeholder={'Təsvir əlavə edin...'}/>
                                <div className={'langCountry'}>
                                    <img src={rus} alt=""/>
                                </div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea  placeholder={'Təsvir əlavə edin...'}/>
                                <div className={'langCountry'}>
                                    <img src={usa} alt=""/>
                                </div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea  placeholder={'Təsvir əlavə edin...'}/>
                                <div className={'langCountry'}>
                                    <img src={ger} alt=""/>
                                </div>
                            </div>
                            <div className={'tours-desc-texts'}>
                                <textarea  placeholder={'Təsvir əlavə edin...'}/>
                                <div className={'langCountry'}>
                                    <img src={arb} alt=""/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={'clinic-edit-data'}>
                        <div className={"dataDiv images2"}>
                            <div className={'header'}>
                                <h3>Xidmətlər</h3>
                                <p>Xidmətin əlaqəli olduğu klinikanı seçin.</p>
                            </div>
                            <div className={'addCategory'}>
                                {arr.map((item, index) => (
                                    <label key={index} className="checkboxItem">
                                        <input
                                            type="checkbox"
                                            checked={activeIcon.includes(index)}
                                            onChange={() => {
                                                setActiveIcon((prev) =>
                                                    prev.includes(index)
                                                        ? prev.filter((i) => i !== index) // varsa sil
                                                        : [...prev, index] // yoxdursa əlavə et
                                                );
                                            }}
                                        />
                                        <span>GlobalMed</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className={"dataDiv images2"}>
                            <div className={'header'}>
                                <h3>Doktor</h3>
                                <p>Xidmətin əlaqəli olduğu doktorları seçin.</p>
                            </div>
                            <div className={'addCategory'}>
                                {arr.map((item, index) => (
                                    <label key={index} className="checkboxItem">
                                        <input
                                            type="checkbox"
                                            checked={activeIcon.includes(index)}
                                            onChange={() => {
                                                setActiveIcon((prev) =>
                                                    prev.includes(index)
                                                        ? prev.filter((i) => i !== index) // varsa sil
                                                        : [...prev, index] // yoxdursa əlavə et
                                                );
                                            }}
                                        />
                                        <span>GlobalMed</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className={"dataDiv images2"}>
                            <div className={'header'}>
                                <h3>Oteller</h3>
                                <p>Xidmətin əlaqəli olduğu otelleri seçin.</p>
                            </div>
                            <div className={'addCategory'}>
                                {arr.map((item, index) => (
                                    <label key={index} className="checkboxItem">
                                        <input
                                            type="checkbox"
                                            checked={activeIcon.includes(index)}
                                            onChange={() => {
                                                setActiveIcon((prev) =>
                                                    prev.includes(index)
                                                        ? prev.filter((i) => i !== index) // varsa sil
                                                        : [...prev, index] // yoxdursa əlavə et
                                                );
                                            }}
                                        />
                                        <span>GlobalMed</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="dataDiv images multi">
                            <div className="header">
                                <h3>Sertifikat</h3>
                                <p>Klinikanı təmsil edəcək sertifikatları yükləyin.</p>
                            </div>

                            <div className="uploadBox">
                                <input
                                    type="file"
                                    id="sertifikat-fileInput"
                                    accept="image/*"
                                    multiple
                                    onChange={handleSertifikatChange}
                                    style={{ display: "none" }}
                                />
                                <label htmlFor="sertifikat-fileInput" className="uploadArea">
                                    <img src={uploadIcon} alt="upload" />
                                    <p>Faylı yükləmək üçün bu sahəyə klikləyin və ya sürükləyin</p>
                                </label>
                            </div>

                            <div className="uploadedHeader" onClick={() => setSertifikatOpen((p) => !p)}>
                                <span>Yüklənənlər</span>
                                <img src={sertifikatOpen ? openIcon : closeIcon} alt="toggle" />
                            </div>

                            {sertifikatOpen && sertifikatFiles.length > 0 && (
                                <div className="uploadedList">
                                    {sertifikatFiles.map((item, index) => (
                                        <div key={index} className="uploadedItem">
                                            <div className="fileLeft">
                                                <img src={item.preview} alt="preview" className="filePreview" />
                                                <span>{item.file.name}</span>
                                            </div>
                                            <button onClick={() => removeSertifikat(index)}>✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 🖼 Galereya */}
                        <div className="dataDiv images multi">
                            <div className="header">
                                <h3>Galereya</h3>
                                <p>Klinikanın mövcud şəkillərini yükləyin.</p>
                            </div>

                            <div className="uploadBox">
                                <input
                                    type="file"
                                    id="galereya-fileInput"
                                    accept="image/*"
                                    multiple
                                    onChange={handleGalereyaChange}
                                    style={{ display: "none" }}
                                />
                                <label htmlFor="galereya-fileInput" className="uploadArea">
                                    <img src={uploadIcon} alt="upload" />
                                    <p>Faylı yükləmək üçün bu sahəyə klikləyin və ya sürükləyin</p>
                                </label>
                            </div>

                            <div className="uploadedHeader" onClick={() => setGalereyaOpen((p) => !p)}>
                                <span>Yüklənənlər</span>
                                <img src={galereyaOpen ? openIcon : closeIcon} alt="toggle" />
                            </div>

                            {galereyaOpen && galereyaFiles.length > 0 && (
                                <div className="uploadedList">
                                    {galereyaFiles.map((item, index) => (
                                        <div key={index} className="uploadedItem">
                                            <div className="fileLeft">
                                                <img src={item.preview} alt="preview" className="filePreview" />
                                                <span>{item.file.name}</span>
                                            </div>
                                            <button onClick={() => removeGalereya(index)}>✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>


                    </div>
                    <button className={'submitButton'}>Yadda saxla</button>
                </div>
            </div>
        </div>
    );
}

export default ClinicEdit;