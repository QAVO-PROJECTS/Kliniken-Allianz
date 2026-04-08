import './index.scss';
import { FaPhone } from 'react-icons/fa6';
import { FiMail } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IoLogoWhatsapp } from 'react-icons/io';
import { AiFillInstagram } from 'react-icons/ai';
import { FaFacebook, FaTiktok } from 'react-icons/fa';
import image1 from '../../../assets/FootLogo.png';

function Footer() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const handleScrollClinic = () => {
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

    const handleScrollServices = () => {
        const element = document.getElementById('home-best-service');
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
        <section id="footer">
            <div className="container">
                <div className="row">
                    <div className="col-20 col-md-60 col-sm-60 col-xs-60">
                        <div className="main-text">
                            <div className="logo">
                                <img
                                    src={image1}
                                    alt={t('footer.logoAlt')}
                                    onClick={() => navigate('/')}
                                    style={{ cursor: 'pointer' }}
                                />
                            </div>
                            <p>{t('footer.description')}</p>
                        </div>
                    </div>
                    <div className="col-40 col-md-60 col-sm-60 col-xs-60">
                        <div className="row">
                            <div className="col-20 col-md-60 col-sm-60 col-xs-60">
                                <div className="services">
                                    <h3>{t('footer.links')}</h3>
                                    <ul>
                                        <li><Link to="/tours" onClick={() => {
                                            handleScrollServices();
                                        }}>{t('navbar.tours')}</Link></li>
                                        <li><Link to="/doctors" onClick={() => {
                                            handleScrollServices();
                                        }}>{t('navbar.doctors')}</Link></li>
                                        <li><Link to="/clinics"  onClick={() => {
                                            handleScrollClinic();
                                        }}>{t('navbar.clinics')}</Link></li>
                                        <li>
                                            <Link
                                                to="/sanatoriums"
                                                className={`link ${location.pathname === '/sanatoriums' ? 'active' : ''}`}
                                                onClick={() =>
                                                    setMenuOpen(false)
                                                }
                                            >
                                                {t('navbar.sanatoriums')}
                                            </Link>
                                        </li>
                                        <li><Link to="/contact">{t('navbar.contact')}</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-20 col-md-60 col-sm-60 col-xs-60">
                                <div className="services">
                                    <h3>{t('footer.contactTitle')}</h3>
                                    <div className="foot-contact">

                                        <div className="content">
                                            <span>{t('footer.call')}</span>
                                            <p><a href="tel:+994502164292">+994 50 216 42 92</a></p>
                                        </div>
                                    </div>
                                    <div className="foot-contact">

                                        <div className="content">
                                            <span>{t('footer.mail')}</span>
                                            <p>
                                                <a href="mailto:klinikenallianz.tibbiturizm@gmail.com">
                                                   klinikenallianz.tibbiturizm@gmail.com
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-20 col-md-60 col-sm-60 col-xs-60">
                                <div className="social">
                                    <div className="icons">
                                        <div className="icon">
                                            <a href="https://wa.me/994502164292" target="_blank" rel="noopener noreferrer">
                                                <IoLogoWhatsapp />
                                            </a>
                                        </div>
                                        <div className="icon">
                                            <a href="https://www.instagram.com/kliniken.allianz/" target="_blank" rel="noopener noreferrer">
                                                <AiFillInstagram />
                                            </a>
                                        </div>
                                        <div className="icon">
                                            <a href="https://www.tiktok.com/@kliniken.allianz" target="_blank" rel="noopener noreferrer">
                                                <FaTiktok />
                                            </a>
                                        </div>
                                        <div className="icon">
                                            <a href="https://www.facebook.com/people/Kliniken-Allianz/61576974924307/" target="_blank" rel="noopener noreferrer">
                                                <FaFacebook />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-60">
                        <div className="row created">
                            <div className="col-30 col-md-60 col-sm-60 col-xs-60">
                                <div className="permision">
                                    {t('footer.copyright')}
                                </div>
                            </div>
                            <div className="col-30 col-md-60 col-sm-60 col-xs-60">
                                <div className="createdBy">
                                    {t('footer.createdBy')} <a href="https://buyontech.net/" target="_blank" rel="noopener noreferrer">BuyonTech</a>
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