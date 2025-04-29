import './index.scss'
import banner from "/src/assets/HomeBanner.png"
import image from "/src/assets/HomeBannerImage.png"
import {FaArrowDownLong, FaArrowRightLong} from "react-icons/fa6";

function HomeBanner() {
    const handleScroll = () => {
        const element = document.getElementById('home-clinic');
        if (element) {
            const offset = -100; // Adjust this value (negative for above, positive for below)
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: elementPosition + offset,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div id={"home-banner"}>
            <div className={"container"}>
                <div className={"row"}>
                    <div className={"col-7 col-md-12 col-sm-12 col-xs-12"}>
                        <div className={"content"}>
                            <h1>Dünyanın Ən Yaxşı Klinikalarına Yol Açın</h1>
                            <p>Ən müasir tibbi xidmətlər və rahat səyahət imkanları ilə sağlığınızı yenidən qazanın.</p>
                            <div onClick={handleScroll}>Keçid edin <button ><FaArrowDownLong /></button></div>
                        </div>
                    </div>
                    <div className={"col-5 col-md-12 col-sm-12 col-xs-12"}>
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