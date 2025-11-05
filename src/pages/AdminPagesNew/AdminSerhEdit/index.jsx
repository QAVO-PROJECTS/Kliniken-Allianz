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
function SerhEdit() {
    const [activeIcon, setActiveIcon] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setSelectedFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) setSelectedFile(file);
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
    };
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
        {},
        {},
        {},
        {},
    ]
    return (
        <div id={'serh-edit'}>
            <div className={'serh-edit'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/serh">Şərh</NavLink>
                        <img src={rootIcon} alt="" />
                        Şərhə düzəliş et
                    </h2>
                </div>
                <div className={'serh-edit-head'}>
                    <h1>Şərhə düzəliş et</h1>
                    <p>Buradan şərhləri idarə edə və düzəliş edə bilərsiniz</p>
                </div>
                <div className={'serh-edit-main'}>
                    <div className={'serh-edit-data'}>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>Şərh yazan</h3>
                                <p>Şərh yazanın sistemdə görünəcək adını daxil edin.</p>
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
                                <h3>Şəkil</h3>
                                <p>Şərh yazan şəxsin profil şəklini yükləyin.</p>
                            </div>

                            <div
                                className={`uploadBox ${isDragging ? "dragging" : ""}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    id="fileInput"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: "none" }}
                                />
                                <label htmlFor="fileInput" className="uploadArea">
                                    <img src={uploadIcon} alt="upload" />
                                    <p>
                                        Faylı yükləmək üçün bu sahəyə klikləyin <br /> və ya sürükləyin
                                    </p>
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
                                    <button onClick={handleRemoveFile}>✕</button>
                                </div>
                            )}
                        </div>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>Təsvir</h3>
                                <p>Şərh mətni daxil edin.</p>
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
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>Şərhin yazıldığı ölkənin adı</h3>
                                <p>Rəyin hansı ölkədən yazıldığını göstərin.</p>
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
                    </div>
                    <button className={'submitButton'}>Yadda saxla</button>
                </div>
            </div>
        </div>
    );
}

export default SerhEdit;