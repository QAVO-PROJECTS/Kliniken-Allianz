import './index.scss';
import image from '/src/assets/HomeBannerImage.png';
import { FaArrowDownLong } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import glass from "/src/assets/glassButton.png"
function HomeBanner() {
    const { t } = useTranslation();


    const handleScroll = () => {
        const element = document.getElementById('home-clinic');
        if (element) {
            const offset = -100;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: elementPosition + offset,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div id={'home-banner'}>
            <div className={'container'}>
                <div className={'row'}>
                    <div className={'col-35 col-md-60 col-sm-60 col-xs-60'}>
                        <div className={'content'}>
                            <h1>{t("homeBanner.title")}</h1>
                            <p>{t("homeBanner.description")}</p>
                            <div className={"muraciet"} onClick={handleScroll}>
                                {t("homeBanner.button")}
                                <img src={glass} className={'glass-image'} />
                            {/*    <button><svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">*/}
                            {/*    <path d="M11.2256 7.60838C11.1641 7.55116 11.1149 7.48216 11.0807 7.40549C11.0466 7.32883 11.0282 7.24607 11.0267 7.16215C11.0252 7.07823 11.0407 6.99487 11.0721 6.91705C11.1035 6.83922 11.1503 6.76853 11.2097 6.70918C11.269 6.64983 11.3397 6.60304 11.4176 6.57161C11.4954 6.54018 11.5787 6.52474 11.6627 6.52622C11.7466 6.5277 11.8293 6.54607 11.906 6.58023C11.9827 6.61439 12.0517 6.66364 12.1089 6.72505L15.4422 10.0584C15.5593 10.1756 15.625 10.3344 15.625 10.5C15.625 10.6657 15.5593 10.8245 15.4422 10.9417L12.1089 14.275C12.0517 14.3365 11.9827 14.3857 11.906 14.4199C11.8293 14.454 11.7466 14.4724 11.6627 14.4739C11.5787 14.4754 11.4954 14.4599 11.4176 14.4285C11.3397 14.397 11.269 14.3503 11.2097 14.2909C11.1503 14.2316 11.1035 14.1609 11.0721 14.083C11.0407 14.0052 11.0252 13.9219 11.0267 13.8379C11.0282 13.754 11.0466 13.6713 11.0807 13.5946C11.1149 13.5179 11.1641 13.4489 11.2255 13.3917L13.4922 11.125L5.41722 11.125C5.25146 11.125 5.09248 11.0592 4.97527 10.942C4.85806 10.8248 4.79222 10.6658 4.79222 10.5C4.79222 10.3343 4.85806 10.1753 4.97527 10.0581C5.09248 9.94089 5.25146 9.87505 5.41722 9.87505L13.4922 9.87505L11.2256 7.60838Z" fill="white"/>*/}
                            {/*</svg></button>*/}
                            </div>
                            <div className={"icons"}>
                                <div className={"icon3"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                                        <circle cx="15.5" cy="15.5" r="15.5" fill="#C7E1FF"/>
                                    </svg>                                </div>
                                <div className={"icon2"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                                        <circle cx="9.5" cy="9.5" r="9.5" fill="#003778" fill-opacity="0.32"/>
                                    </svg>
                                </div>

                            </div>

                        </div>
                    </div>
                    <div className={'col-25 col-md-60 col-sm-60 col-xs-60'}>
                        <div className={'image'}>
                            <img src={image} alt={t('homeBanner.imageAlt')} />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default HomeBanner;