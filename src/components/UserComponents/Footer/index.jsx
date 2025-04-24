import './index.scss'
import { FaPhone } from "react-icons/fa6";
import {FiFacebook, FiMail} from "react-icons/fi";
import {Link, useNavigate} from "react-router-dom";
import {Trans, useTranslation} from "react-i18next";
import {IoLogoWhatsapp} from "react-icons/io";
import {AiFillInstagram} from "react-icons/ai";
import {FaFacebook, FaTiktok} from "react-icons/fa";
import image1 from "../../../assets/FootLogo.png";

function Footer() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <section id={"footer"}>
            <div className={"container"}>
                <div className={"row"}>
                    <div className={"col-4 col-md-12 col-sm-12 col-xs-12"}>
                        <div className={"main-text"}>
                            <div className="logo">
                                <img
                                    src={image1 }
                                    alt="Logo"
                                    onClick={() => {
                                        navigate('/');
                                    }}
                                    style={{ cursor: 'pointer' }}
                                />
                            </div>
                            <p>Müalicə prosesi, uçuş, viza dəstəyi və qalacaq yer kimi bütün detalları sizin üçün düşünür və planlayırıq.</p>
                        </div>
                    </div>
                    <div className={"col-8 col-md-12 col-sm-12 col-xs-12"}>
                        <div className={"row"}>
                            <div className={"col-4 col-md-12 col-sm-12 col-xs-12"}>
                                <div className={"services"}>
                                    <h3>Keçidlər</h3>
                                    <li><Link to={"/"}>Ana səhifə</Link></li>
                                    <li><Link to={"/services"}>Xidmətlər</Link></li>
                                    <li><Link to={"/clinics"}>Klinikalar</Link></li>
                                    <li><Link to={"/contact"}>Əlaqə</Link></li>
                                </div>
                            </div>
                            <div className={"col-4 col-md-12 col-sm-12 col-xs-12"}>
                                <div className={"services"}>
                                    <div className={"foot-contact"}>
                                        <div className={"icons"}>
                                            <FaPhone className={"icon"} />
                                        </div>
                                        <div className={"content"}>
                                            <span>{t('footer.call')}</span>
                                            <p><a href={"tel:994552999555"}>+994 55 299 95 55</a></p>
                                        </div>
                                    </div>
                                    <div className={"foot-contact"}>
                                        <div className={"icons"}>
                                            <FiMail className={"icon"} />
                                        </div>
                                        <div className={"content"}>
                                            <span>{t('footer.mail')}</span>
                                            <p>
                                                <a href={"mailto:info.sssinsaat@gmail.com"}>
                                                    info.sssinsaat@gmail.com
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={"col-4 col-md-12 col-sm-12 col-xs-12"}>
                                <div className={"social"}>
                                    <div className={"icons"}>

                                        <div className={"icon"} >
                                            <a href={"https://wa.me/994552999555"} target={"_blank"}><IoLogoWhatsapp /></a>

                                        </div>
                                        <div className={"icon"} >
                                            <a href={"https://www.instagram.com/ssoglu.construction/"} target={"_blank"}><AiFillInstagram /></a>

                                        </div>
                                        <div className={"icon"} >
                                            <a href={"https://www.tiktok.com/@ssoglu.construction"} target={"_blank"}><FaTiktok /></a>

                                        </div>
                                        <div className={"icon"} >
                                            <a href={"https://www.facebook.com/people/Ssogluconstructions/61570216319110/"} target={"_blank"}><FaFacebook /></a>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"col-12"}>
                        <div className={"row created"}>
                            <div className={"col-6 col-md-12 col-sm-12 col-xs-12"}>
                                <div className={"permision"}>
                                    © 2025 Kliniken Allianz. Bütün hüquqlar qorunur.
                                </div>
                            </div>
                            <div className={"col-6 col-md-12 col-sm-12 col-xs-12"}>
                                <div className={"createdBy"}>
                                    Created by <a href={"https://qavo.az/"} target={"_blank"}>Qavo Codes</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Footer;
