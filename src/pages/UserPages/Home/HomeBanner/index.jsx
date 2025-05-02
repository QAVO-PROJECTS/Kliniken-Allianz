import './index.scss';
import banner from '/src/assets/HomeBanner.png';
import image from '/src/assets/HomeBannerImage.png';
import { FaArrowDownLong } from 'react-icons/fa6';
import { useMediaQuery } from 'react-responsive';
import mobileBanner from '/src/assets/MobilHomeBanner.png';
import { useTranslation } from 'react-i18next';

function HomeBanner() {
    const { t } = useTranslation();
    const isMobile = useMediaQuery({ maxWidth: 768 });

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
                    <div className={'col-7 col-md-12 col-sm-12 col-xs-12'}>
                        <div className={'content'}>
                            <h1>{t('homeBanner.title')}</h1>
                            <p>{t('homeBanner.description')}</p>
                            <div className={"muraciet"} onClick={handleScroll}>
                                {t('homeBanner.button')} <button><FaArrowDownLong /></button>
                            </div>
                            <div className={"icons"}>
                                <div className={"icon3"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                                        <circle cx="15.5" cy="15.5" r="15.5" fill="#DEFAFE"/>
                                    </svg>
                                </div>
                                <div className={"icon2"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                                        <circle cx="9.5" cy="9.5" r="9.5" fill="#CCF8E6"/>
                                    </svg>
                                </div>
                                <div className={"icon4"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                                        <circle cx="9.5" cy="9.5" r="9.5" fill="#CCF8E6"/>
                                    </svg>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className={'col-5 col-md-12 col-sm-12 col-xs-12'}>
                        <div className={'image'}>
                            <img src={image} alt={t('homeBanner.imageAlt')} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={'banner'}>
                <img src={isMobile ? mobileBanner : banner} alt={t('homeBanner.bannerAlt')} />
            </div>
        </div>
    );
}

export default HomeBanner;