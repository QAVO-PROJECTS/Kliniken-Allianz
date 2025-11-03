import './index.scss'
import {NavLink} from "react-router-dom";
import rootIcon from '/src/assets/rootIcon.svg'
import aze from '/src/assets/azerbaijan.svg'
import rus from '/src/assets/russia.svg'
import usa from '/src/assets/unitedstates.svg'
import ger from '/src/assets/germany.svg'
import arb from '/src/assets/unitedarabemirates.svg'
import cat1 from "../../../assets/Servis/cat1.svg";
import {useState} from "react";
function CategoryAdd() {
    const [activeIcon, setActiveIcon] = useState(null);
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
        <div id={'category-add'}>
            <div className={'category-add'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/category">Kateqoriya</NavLink>
                        <img src={rootIcon} alt="" />
                        Yeni kateqoriya yarat
                    </h2>
                </div>
                <div className={'category-add-head'}>
                    <h1>Yeni kateqoriya yarat</h1>
                    <p>Buradan kateqoriyaları idarə edə və yenilərini yarada bilərsiniz.</p>
                </div>
                <div className={'category-add-main'}>
                    <div className={'category-add-data'}>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>Kateqoriya adı</h3>
                                <p>Kateqoriyanın sistemdə görünəcək adını daxil edin.</p>
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
                        <div className={"dataDiv images"}>
                            <div className={'header'}>
                                <h3>Kateqoriyanızı fərqləndirin</h3>
                                <p>Bu ikon kateqoriyanızın görünüşünü müəyyən edəcək. Sadəcə birini seçin.</p>
                            </div>
                            <div className={'addCategory'}>
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
                    </div>
                    <button>Yadda saxla</button>
                </div>
            </div>
        </div>
    );
}

export default CategoryAdd;