import './index.scss'
import {NavLink} from "react-router-dom";
import rootIcon from '/src/assets/rootIcon.svg'
function CategoryAdd() {
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
                                    <div className={'add-input'}></div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}></div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}></div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}></div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}></div>
                                </div>
                            </div>
                        </div>
                        <div className={"dataDiv images"}></div>
                    </div>
                    <button>Yadda saxla</button>
                </div>
            </div>
        </div>
    );
}

export default CategoryAdd;