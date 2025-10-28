import "./index.scss";
import { Link, useParams } from "react-router-dom";
import banners from "/src/assets/AboutBanner.png";
import mobileBanners from "/src/assets/MobileBanner.png";
import {useTranslation} from "react-i18next";
import red from "/src/assets/redTeklif.svg"
import blue from "/src/assets/blueTeklif.svg"
import img1 from '/src/assets/turDetail1.jpg'
import img2 from '/src/assets/turDetail2.jpg'
import img3 from '/src/assets/turDetail3.jpg'
import {useMediaQuery} from "react-responsive";
function TourDetail() {
    const { id } = useParams();
    const {t} = useTranslation();
    const isMobile = useMediaQuery({maxWidth:768})
    return (
        <div id="tour-detail">
            <div className="container">
                <div className="head">
                    <h1>Almanya full paket</h1>
                    <p data-aos="fade-up" data-aos-delay="100">
                        <Link to="/">{t("contact.breadcrumb.home")}</Link>
                        <div className="dot dot1"></div>
                        <Link to="/">Tibbi Tur Paketləri</Link>
                        <div className="dot dot2"></div>
                        <Link to="/clinics">Almanya full paket</Link>
                    </p>
                </div>
                <div className={"row"}>
                    <div className={'col-30 col-md-60 col-sm-60 col-xs-60 order2'}>
                        <div className={'content'}>
                            <h2>Almanya full paket</h2>
                            <p>Ürək və damar xəstəlikləri dünya üzrə ən geniş yayılmış sağlamlıq problemlərindəndir. Kliniken Allianz olaraq, bu sahədə ixtisaslaşmış, beynəlxalq təcrübəyə malik həkimlər və yüksək texnologiyalı klinikalarla əməkdaşlıq edirik.</p>
                            <div className={'row'}>
                                <div className={'col-30'}>
                                    <div className={'teklif'}>
                                        <img src={red} alt="" />
                                        <h5>Otel dəstəyi</h5>
                                    </div>
                                </div>
                                <div className={'col-30'}>
                                    <div className={'teklif'}>
                                        <img src={red} alt="" />
                                        <h5>Otel dəstəyi</h5>
                                    </div>
                                </div>
                                <div className={'col-30'}>
                                    <div className={'teklif'}>
                                        <img src={blue} alt="" />
                                        <h5>Otel dəstəyi</h5>
                                    </div>
                                </div>
                                <div className={'col-30'}>
                                    <div className={'teklif'}>
                                        <img src={blue} alt="" />
                                        <h5>Otel dəstəyi</h5>
                                    </div>
                                </div>
                                <div className={'col-30'}>
                                    <div className={'teklif'}>
                                        <img src={red} alt="" />
                                        <h5>Otel dəstəyi</h5>
                                    </div>
                                </div>
                                <div className={'col-30'}>
                                    <div className={'teklif'}>
                                        <img src={red} alt="" />
                                        <h5>Otel dəstəyi</h5>
                                    </div>
                                </div>
                            </div>
                            <button>Müraciət et</button>
                        </div>
                    </div>
                    <div className={'col-30 col-md-60 col-sm-60 col-xs-60 order1'}>
                        <div className="image-grid">
                            <div className="image image1">
                                <img src={img1} alt="Germany"/>
                            </div>
                            <div className="image image2">
                                <img src={img2} alt="Laboratory"/>
                            </div>
                            <div className="image image3">
                                <img src={img3} alt="Hospital"/>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
            <div className="bannerAbout">
                <img src={isMobile? mobileBanners : banners} alt={t("contact.bannerAlt")}/>
            </div>
        </div>
    );
}

export default TourDetail;