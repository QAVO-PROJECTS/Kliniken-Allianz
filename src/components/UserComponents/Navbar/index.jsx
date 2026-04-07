import './index.scss';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '../../../utils/getLocalizedText.js';

import flagAz from '/src/assets/azerbaijan.png';
import flagEn from '/src/assets/uk.png';
import flagRu from '/src/assets/circle.png';
import image1 from '/src/assets/Logo.png';
import CategoriesMenuAntd from "../../CustomDropdownShadcn/index.jsx";
import {
    useGetAllClinicQuery,
    useGetAllSanatoriumQuery,
    useGetAllToursQuery,
    useGetAllDoctorsQuery,
    useGetAllCategoryQuery,
    useGetAllServiceQuery
} from "../../../services/userApi.jsx";
import {
    CLINIC_CARD_IMAGES,
    SANATORIUM_CARD_IMAGES,
    TOUR_CARD_IMG,
    DOCTOR_IMG_URL,
    CATEGORY_IMAGES,
    SERVICE_CARD_IMAGES
} from "../../../contants.js";

const LANGUAGES = {
    az: { flag: flagAz, label: 'AZ', name: 'Azərbaycan' },
    en: { flag: flagEn, label: 'EN', name: 'English' },
    ru: { flag: flagRu, label: 'RU', name: 'Русский' },
};

const SearchIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);
const HeartIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);
const CartIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
);
const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);
const MenuIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);
const PhoneIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.6 1.17h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16.92z" />
    </svg>
);
const UserIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);
const ChevronDown = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

function Navbar() {
    const [menuOpen, setMenuOpen]         = useState(false);
    const [langOpen, setLangOpen]         = useState(false);
    const [mobileLangOpen, setMobileLangOpen] = useState(false);
    const [phoneOpen, setPhoneOpen]       = useState(false);
    const [searchOpen, setSearchOpen]     = useState(false);
    const [searchQuery, setSearchQuery]   = useState('');
    const [mobileCatsOpen, setMobileCatsOpen] = useState(false);

    const { t, i18n } = useTranslation();
    const navigate    = useNavigate();
    const location    = useLocation();
    const langRef     = useRef(null);
    const searchRef   = useRef(null);

    const currentLangKey = Object.keys(LANGUAGES).find(l => i18n.language?.startsWith(l)) || 'az';
    const currentLang    = LANGUAGES[currentLangKey];

    // SEARCH DATA
    const { data: clinicsData }    = useGetAllClinicQuery();
    const { data: sanatoriumsData } = useGetAllSanatoriumQuery();
    const { data: toursData }      = useGetAllToursQuery();
    const { data: doctorsData }    = useGetAllDoctorsQuery();
    const { data: categoriesData } = useGetAllCategoryQuery();
    const { data: servicesData }   = useGetAllServiceQuery();


    const filteredClinics = searchQuery.length > 1
        ? clinicsData?.data?.filter(item => getLocalizedText(item, 'name').toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    const filteredSanatoriums = searchQuery.length > 1
        ? sanatoriumsData?.data?.filter(item => getLocalizedText(item, 'name').toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    const filteredTours = searchQuery.length > 1
        ? toursData?.data?.filter(item => getLocalizedText(item, 'name').toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    const filteredDoctors = searchQuery.length > 1
        ? doctorsData?.data?.filter(item => {
            const fullName = `${getLocalizedText(item, 'name')} ${getLocalizedText(item, 'surName')}`;
            return fullName.toLowerCase().includes(searchQuery.toLowerCase());
        })
        : [];

    const filteredServices = searchQuery.length > 1
        ? (() => {
            const query = searchQuery.toLowerCase();
            const fromServices = servicesData?.data?.filter(item => 
                getLocalizedText(item, 'name').toLowerCase().includes(query)
            ) || [];
            
            const fromCategories = categoriesData?.data?.filter(cat => 
                getLocalizedText(cat, 'name').toLowerCase().includes(query)
            ).flatMap(cat => cat.services || []) || [];

            const combined = [...fromServices, ...fromCategories];
            return combined.filter((svc, index, self) => 
                index === self.findIndex((t) => t.id === svc.id)
            );
        })()
        : [];

    const hasResults = filteredClinics?.length > 0 || filteredSanatoriums?.length > 0 || filteredTours?.length > 0 || filteredDoctors?.length > 0 || filteredServices?.length > 0;

    useEffect(() => {
        const stored = localStorage.getItem('i18nextLng');
        if (stored && stored !== i18n.language) i18n.changeLanguage(stored);
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
            if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const changeLang = (key) => {
        i18n.changeLanguage(key);
        localStorage.setItem('i18nextLng', key);
        setLangOpen(false);
        setMobileLangOpen(false);
    };

    const closeMenu = () => setMenuOpen(false);

    const closeSearch = () => {
        setSearchOpen(false);
        setSearchQuery('');
    };

    const NAV_LINKS = [
        { to: '/clinics',     key: 'clinics' },
        { to: '/sanatoriums', key: 'sanatoriums' },
        { to: '/doctors',     key: 'doctors' },
        { to: '/tours',       key: 'tours' },
        { to: '/about',       key: 'about' },
        { to: '/contact',     key: 'contact' },
    ];

    return (
        <>
            <div className={`nb-overlay${menuOpen ? ' show' : ''}`} onClick={closeMenu} />

            <header id="myNavbar">
                <div className="nb-top-bar" />

                <div className="nb-inner">
                    {/* LOGO */}
                    <div className="nb-logo" onClick={() => { navigate('/'); closeMenu(); }}>
                        <img src={image1} alt="Logo" />
                    </div>

                    {/* DESKTOP NAV */}
                    <nav className="nb-desktop-nav">
                        <CategoriesMenuAntd />
                        {NAV_LINKS.map(({ to, key }) => (
                            <Link
                                key={key}
                                to={to}
                                className={`nb-link${location.pathname === to ? ' active' : ''}`}
                            >
                                {t(`navbar.${key}`)}
                            </Link>
                        ))}
                    </nav>

                    {/* RIGHT ACTIONS */}
                    <div className="nb-actions">
                        <div className={`nb-search-wrap${searchOpen ? ' open' : ''}`} ref={searchRef}>
                            <button
                                className="nb-icon-btn"
                                onClick={() => setSearchOpen(p => !p)}
                                aria-label="Axtar"
                            >
                                {searchOpen ? <CloseIcon /> : <SearchIcon />}
                            </button>

                            {searchOpen && (
                                <div className="nb-search-dropdown">
                                    <div className="nb-search-input-box">
                                        <input
                                            type="text"
                                            autoFocus
                                            placeholder={t('navbar.searchPlaceholder') || 'Axtar...'}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>

                                    <div className="nb-search-results">
                                        {searchQuery.length > 1 && !hasResults && (
                                            <div className="nb-no-results">{t('navbar.noResults') || 'Nəticə tapılmadı'}</div>
                                        )}

                                        {filteredClinics?.length > 0 && (
                                            <div className="nb-search-group">
                                                <div className="nb-group-title">{t('navbar.clinics')}</div>
                                                {filteredClinics.map(item => (
                                                    <div
                                                        key={item.id}
                                                        className="nb-result-item"
                                                        onClick={() => { navigate(`/clinics/${item.id}`); closeSearch(); }}
                                                    >
                                                        <img src={CLINIC_CARD_IMAGES + item.clinicCardImage} alt="" />
                                                        <div className="nb-result-info">
                                                            <span className="nb-res-name">{getLocalizedText(item, 'name')}</span>
                                                            <span className="nb-res-type">{t('navbar.clinic')}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {filteredSanatoriums?.length > 0 && (
                                            <div className="nb-search-group">
                                                <div className="nb-group-title">{t('navbar.sanatoriums')}</div>
                                                {filteredSanatoriums.map(item => (
                                                    <div
                                                        key={item.id}
                                                        className="nb-result-item"
                                                        onClick={() => { navigate(`/sanatoriums/${item.id}`); closeSearch(); }}
                                                    >
                                                        <img src={SANATORIUM_CARD_IMAGES + item.sanatoriumCardImage} alt="" />
                                                        <div className="nb-result-info">
                                                            <span className="nb-res-name">{getLocalizedText(item, 'name')}</span>
                                                            <span className="nb-res-type">{t('navbar.sanatorium')}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {filteredTours?.length > 0 && (
                                            <div className="nb-search-group">
                                                <div className="nb-group-title">{t('navbar.tours')}</div>
                                                {filteredTours.map(item => (
                                                    <div
                                                        key={item.id}
                                                        className="nb-result-item"
                                                        onClick={() => { navigate(`/tours/${item.id}`); closeSearch(); }}
                                                    >
                                                        <img src={TOUR_CARD_IMG + item.cardImage} alt="" />
                                                        <div className="nb-result-info">
                                                            <span className="nb-res-name">{getLocalizedText(item, 'name')}</span>
                                                            <span className="nb-res-type">{t('navbar.tour')}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {filteredDoctors?.length > 0 && (
                                            <div className="nb-search-group">
                                                <div className="nb-group-title">{t('navbar.doctors')}</div>
                                                {filteredDoctors.map(item => (
                                                    <div
                                                        key={item.id}
                                                        className="nb-result-item"
                                                        onClick={() => { navigate(`/doktor/${item.id}`); closeSearch(); }}
                                                    >
                                                        <img src={DOCTOR_IMG_URL + item.doctorImage} alt="" />
                                                        <div className="nb-result-info">
                                                            <span className="nb-res-name">{getLocalizedText(item, 'name')} {getLocalizedText(item, 'surName')}</span>
                                                            <span className="nb-res-type">{t('navbar.doctor')}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {filteredServices?.length > 0 && (
                                            <div className="nb-search-group">
                                                <div className="nb-group-title">{t('navbar.services') || 'Xidmətlər'}</div>
                                                {filteredServices.map(item => (
                                                    <div
                                                        key={item.id}
                                                        className="nb-result-item"
                                                        onClick={() => { navigate(`/category/${item.id}`); closeSearch(); }}
                                                    >
                                                        <div className="nb-res-icon-box">
                                                            {item.serviceCardImage && (
                                                                <img src={SERVICE_CARD_IMAGES + item.serviceCardImage} alt="" />
                                                            )}
                                                        </div>
                                                        <div className="nb-result-info">
                                                            <span className="nb-res-name">{getLocalizedText(item, 'name')}</span>
                                                            <span className="nb-res-type">{t('navbar.service') || 'Xidmət'}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {searchQuery.length === 0 && servicesData?.data?.length > 0 && (
                                            <div className="nb-suggested">
                                                <div className="nb-suggested-title">{t('navbar.suggestedServices') || 'Önerilən Xidmətlər'}</div>
                                                <div className="nb-suggested-list">
                                                    {servicesData.data.slice(0, 8).map(item => (
                                                        <div
                                                            key={item.id}
                                                            className="nb-suggested-item"
                                                            onClick={() => { navigate(`/category/${item.id}`); closeSearch(); }}
                                                        >
                                                            {item.serviceCardImage && (
                                                                <img src={SERVICE_CARD_IMAGES + item.serviceCardImage} alt="" />
                                                            )}
                                                            <span>{getLocalizedText(item, 'name')}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Desktop Language */}
                        <div className="nb-lang-wrap nb-hide-mobile" ref={langRef}>
                            <button className="nb-lang-btn" onClick={() => setLangOpen(p => !p)}>
                                <img src={currentLang.flag} alt={currentLangKey} />
                                <span>{currentLang.label}</span>
                                <ChevronDown />
                            </button>
                            <div className={`nb-lang-dropdown${langOpen ? ' show' : ''}`}>
                                {Object.entries(LANGUAGES).map(([key, lang]) => (
                                    <div
                                        key={key}
                                        className={`nb-lang-item${currentLangKey === key ? ' active' : ''}`}
                                        onClick={() => changeLang(key)}
                                    >
                                        <img src={lang.flag} alt={key} />
                                        <span>{lang.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Burger */}
                        <button className="nb-burger" onClick={() => setMenuOpen(p => !p)} aria-label="Menyu">
                            <MenuIcon />
                        </button>
                    </div>
                </div>
            </header>

            {/* MOBILE DRAWER */}
            <div className={`nb-drawer${menuOpen ? ' open' : ''}`}>
                {/* Header */}
                <div className="nb-drawer-header">
                    <img
                        src={image1}
                        alt="Logo"
                        className="nb-drawer-logo"
                        onClick={() => { navigate('/'); closeMenu(); }}
                    />
                    <div className="nb-drawer-header-actions">
                        <button className="nb-icon-btn" onClick={closeMenu}><CloseIcon /></button>
                    </div>
                </div>

                {/* Phone */}
                <div className="nb-drawer-row" onClick={() => setPhoneOpen(p => !p)}>
                    <div className="nb-drawer-row-left">
                        <PhoneIcon />
                        <span>+994 (50) 216-42-92</span>
                    </div>
                </div>

                {/* Language */}
                <div className="nb-drawer-row" onClick={() => setMobileLangOpen(p => !p)}>
                    <div className="nb-drawer-row-left">
                        <img src={currentLang.flag} alt={currentLangKey} className="nb-drawer-flag" />
                        <span>{currentLang.label}</span>
                    </div>
                    <span className={`nb-drawer-chevron${mobileLangOpen ? ' open' : ''}`}><ChevronDown /></span>
                </div>
                {mobileLangOpen && (
                    <div className="nb-drawer-sub">
                        {Object.entries(LANGUAGES).map(([key, lang]) => (
                            <div
                                key={key}
                                className={`nb-drawer-lang-item${currentLangKey === key ? ' active' : ''}`}
                                onClick={() => changeLang(key)}
                            >
                                <img src={lang.flag} alt={key} />
                                <span>{lang.name}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Categories (Mobile) */}
                <div className="nb-drawer-row" onClick={() => setMobileCatsOpen(p => !p)}>
                    <div className="nb-drawer-row-left">
                        <MenuIcon />
                        <span>{t('categoriesMenu.title')}</span>
                    </div>
                    <span className={`nb-drawer-chevron${mobileCatsOpen ? ' open' : ''}`}><ChevronDown /></span>
                </div>
                {mobileCatsOpen && (
                    <div className="nb-drawer-sub nb-mobile-cats">
                        {categoriesData?.data?.map(cat => (
                            <div key={cat.id} className="nb-mobile-cat-item">
                                <div 
                                    className="nb-mobile-cat-header"
                                    onClick={() => { navigate(`/category/${cat.id}`); closeMenu(); }}
                                >
                                    {cat.categoryImage && (
                                        <img src={CATEGORY_IMAGES + cat.categoryImage} alt="" className="nb-mobile-cat-icon" />
                                    )}
                                    <span>{getLocalizedText(cat, 'name')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Nav links */}
                <div className="nb-drawer-links">
                    {NAV_LINKS.map(({ to, key }) => (
                        <Link
                            key={key}
                            to={to}
                            className={`nb-drawer-link${location.pathname === to ? ' active' : ''}`}
                            onClick={closeMenu}
                        >
                            {t(`navbar.${key}`)}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Navbar;