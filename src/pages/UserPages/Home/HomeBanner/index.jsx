import './index.scss'
import banner from "/src/assets/HomeBanner.png"
import image from "/src/assets/HomeBannerImage.png"
import {FaArrowRightLong} from "react-icons/fa6";

function HomeBanner() {
    return (
        <div id={"home-banner"}>
            <div className={"container"}>
                <div className={"row"}>
                    <div className={"col-7"}>
                        <div className={"content"}>
                            <h1>Dünyanın Ən Yaxşı Klinikalarına Yol Açın</h1>
                            <p>Ən müasir tibbi xidmətlər və rahat səyahət imkanları ilə sağlığınızı yenidən qazanın.</p>
                            <div>Ətraflı bax <button><FaArrowRightLong /></button></div>
                        </div>
                    </div>
                    <div className={"col-5"}>
                        <div className={"image"}>
                            <img src={image} alt={""}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"banner"}>
                <img src={banner} alt="banner"/>
            </div>
        </div>
    );
}

export default HomeBanner;