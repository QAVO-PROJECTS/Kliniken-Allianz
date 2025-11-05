import './index.scss'
import {NavLink} from "react-router-dom";
import rootIcon from '/src/assets/rootIcon.svg'
import rootIcongri from '/src/assets/adminNavİcon2.svg'
import aze from '/src/assets/azerbaijan.svg'
import rus from '/src/assets/russia.svg'
import usa from '/src/assets/unitedstates.svg'
import ger from '/src/assets/germany.svg'
import arb from '/src/assets/unitedarabemirates.svg'
import cat1 from "../../../assets/Servis/cat1.svg";
import {useState} from "react";

function CategoryServisAdd() {
    const [activeIcon, setActiveIcon] = useState([]); // array halında saxla


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
        <div id={'category-servis-add'}>
            <div className={'category-servis-add'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/category">Kateqoriya</NavLink>
                        <img src={rootIcongri} alt=""/>
                        <NavLink className="link" to="/admin/category">Xərçəng müalicəsi</NavLink>
                        <img src={rootIcon} alt=""/>
                        Yenisini yarat
                    </h2>
                </div>
                <div className={'category-servis-add-head'}>
                    <h1>Yeni xidmət yarat</h1>
                    <p>Buradan xidmətləri idarə edə və yenilərini yarada bilərsiniz.</p>
                </div>
                <div className={'category-servis-add-main'}>
                    <div className={'category-servis-add-data'}>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>Xidmət adı</h3>
                                <p>Xidmətin sistemdə görünəcək adını daxil edin.</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={'Travmatologiya'}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={aze} alt=""/>
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={'Travmatologiya'}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={rus} alt=""/>
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={'Travmatologiya'}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={usa} alt=""/>
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={'Travmatologiya'}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={ger} alt=""/>
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input placeholder={'Travmatologiya'}/>
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={arb} alt=""/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"dataDiv images"}>
                            <div className={'header'}>
                                <h3>Klinika</h3>
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
                    </div>
                    <div className={'category-servis-desc'}>
                        <div className={'header'}>
                            <h3>Təsvir</h3>
                            <p>Xidmətin qısa təsvirini yazın.</p>
                        </div>
                        <div className={'category-servis-desc-data'}>
                            <div className={'category-servis-desc-texts'}>
                                <textarea placeholder={'Təsvir əlavə edin...'}/>
                                <div className={'langCountry'}>
                                    <img src={aze} alt=""/>
                                </div>
                            </div>
                            <div className={'category-servis-desc-texts'}>
                                <textarea  placeholder={'Təsvir əlavə edin...'}/>
                                <div className={'langCountry'}>
                                    <img src={rus} alt=""/>
                                </div>
                            </div>
                            <div className={'category-servis-desc-texts'}>
                                <textarea  placeholder={'Təsvir əlavə edin...'}/>
                                <div className={'langCountry'}>
                                    <img src={usa} alt=""/>
                                </div>
                            </div>
                            <div className={'category-servis-desc-texts'}>
                                <textarea  placeholder={'Təsvir əlavə edin...'}/>
                                <div className={'langCountry'}>
                                    <img src={ger} alt=""/>
                                </div>
                            </div>
                            <div className={'category-servis-desc-texts'}>
                                <textarea  placeholder={'Təsvir əlavə edin...'}/>
                                <div className={'langCountry'}>
                                    <img src={arb} alt=""/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button>Yadda saxla</button>
                </div>
            </div>
        </div>
    );
}

export default CategoryServisAdd;