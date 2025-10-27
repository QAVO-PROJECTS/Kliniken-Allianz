import {useState, useEffect} from 'react';
import './index.scss';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import AOS from 'aos';
import 'aos/dist/aos.css';
import menu from "/src/assets/majesticons_menu.png"
import flagAz from '/src/assets/azerbaijan.png';
import flagEn from '/src/assets/uk.png';
import flagRu from '/src/assets/circle.png';
import flagArb from '/src/assets/arabia.png';
import image1 from '/src/assets/Logo.png';
import {FaChevronDown} from 'react-icons/fa';
import searchIcon from '/src/assets/mingcute_search-line.png';
import CategoriesMenuAntd from "../../CustomDropdownShadcn/index.jsx";
import {useMediaQuery} from "react-responsive";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);

    const [langTimeoutId, setLangTimeoutId] = useState(null);
    const isMobile = useMediaQuery({maxWidth:768})
    const {t, i18n} = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        AOS.init({
            duration: 100,
            easing: 'ease-out',
            once: true,
        });

        const storedLang = localStorage.getItem('i18nextLng');
        if (storedLang && storedLang !== i18n.language) {
            i18n.changeLanguage(storedLang);
        }
    }, [i18n]);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleLangDropdown = () => {
        setLangDropdownOpen(!langDropdownOpen);
    };


    const handleLanguageChange = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('i18nextLng', lng);
        setLangDropdownOpen(false);
    };

    let currentFlag = flagAz;
    let currentLanguage = "AZE";
    if (i18n.language?.startsWith('en')) {
        currentFlag = flagEn;
        currentLanguage = "ENG";
    } else if (i18n.language?.startsWith('ru')) {
        currentFlag = flagRu;
        currentLanguage = "RU";
    } else if (i18n.language?.startsWith('az')) {
        currentFlag = flagAz;
        currentLanguage = "AZE";
    } else if (i18n.language?.startsWith('arb')) {
        currentFlag = flagArb;
    }

    const handleLangMouseEnter = () => {
        if (langTimeoutId) {
            clearTimeout(langTimeoutId);
            setLangTimeoutId(null);
        }
    };

    const handleLangMouseLeave = () => {
        const timeout = setTimeout(() => {
            setLangDropdownOpen(false);
        }, 1000);
        setLangTimeoutId(timeout);
    };


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
        <section
            id="myNavbar"
            data-aos="slide-down"
            data-aos-delay="100"
            data-aos-anchor-placement="top-center"
        >
            <div className="linear"></div>
            <div className="container" style={{padding: '8px'}}>
                <div className="wrapper">
                    <div className="logo">
                        <img
                            src={image1}
                            alt="Logo"
                            onClick={() => {
                                navigate('/');
                                setMenuOpen(false);
                            }}
                            style={{cursor: 'pointer'}}
                        />
                    </div>
                    <nav className={`nav-links ${menuOpen ? 'active' : ''}`}>
                        {/*<Link*/}
                        {/*    to="/"*/}
                        {/*    className={`link ${location.pathname === '/' ? 'active' : ''}`}*/}
                        {/*    onClick={() => setMenuOpen(false)}*/}
                        {/*>*/}
                        {/*    {t('navbar.home')}*/}
                        {/*</Link>*/}
                        <Link
                            to="/services"
                            className={`link ${location.pathname === '/services' ? 'active' : ''}`}
                            onClick={() =>
                                setMenuOpen(false)

                            }
                        >
                            {t('navbar.services')}
                        </Link>
                        <Link
                            to="/clinics"
                            className={`link ${location.pathname === '/clinics' ? 'active' : ''}`}
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        >
                            {t('navbar.clinics')}
                        </Link>
                        <Link
                            to="/doctors"
                            className={`link ${location.pathname === '/doctors' ? 'active' : ''}`}
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        >
                            Həkimlər
                        </Link>
                        <Link
                            to="/tours"
                            className={`link ${location.pathname === '/tours' ? 'active' : ''}`}
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        >
                            Turlar
                        </Link>
                        <Link
                            to="/about"
                            className={`link ${location.pathname === '/about' ? 'active' : ''}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            {t('navbar.about')}
                        </Link>
                        <Link
                            to="/contact"
                            className={`link ${location.pathname === '/contact' ? 'active' : ''}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            {t('navbar.contact')}
                        </Link>
                        {/*<CategoriesMenuAntd />*/}
                    </nav>
               <div className={'settings'}>
                  <div className={'mobilee'}>
                      <div className={"searchIcon"}>
                          <img src={searchIcon}/>
                      </div>
                      <div className={'vrLine'}></div>
                      <div className="burger" onClick={toggleMenu}>
                          <div><img src={menu}/></div>
                      </div>
                  </div>
                   <div className={'desktopp'}>
                       <div className={"searchIcon"}>
                           <img src={searchIcon}/>
                       </div>
                       <div className={'vrLine'}></div>
                       <div className="language">
                           <div
                               className="dropdown"
                               onClick={toggleLangDropdown}
                               onMouseEnter={handleLangMouseEnter}
                               onMouseLeave={handleLangMouseLeave}
                           >
                               <button className="dropbtn">
                                   <img src={currentFlag} alt="Current Flag"/> <span>{currentLanguage}</span>
                                   <FaChevronDown className="zakirinChevronu"/>
                               </button>
                               <div className={`dropdown-content ${langDropdownOpen ? 'show' : ''}`}>
                                   <div onClick={() => handleLanguageChange('az')}>
                                       <img src={flagAz} alt="AZ Flag"/> {t('navbar.languages.az')}
                                   </div>
                                   <div onClick={() => handleLanguageChange('en')}>
                                       <img src={flagEn} alt="EN Flag"/> {t('navbar.languages.en')}
                                   </div>
                                   <div onClick={() => handleLanguageChange('ru')}>
                                       <img src={flagRu} alt="RU Flag"/> {t('navbar.languages.ru')}
                                   </div>
                                   {/*<div onClick={() => handleLanguageChange('arb')}>*/}
                                   {/*    <img src={flagArb} alt="Arb Flag" /> {t('navbar.languages.ru')}*/}
                                   {/*</div>*/}
                               </div>
                           </div>
                       </div>
                   </div>

               </div>

                </div>
            </div>
        </section>
    );
}

export default Navbar;