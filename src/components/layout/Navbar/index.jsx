import './index.scss';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    ArrowRight,
    Building2,
    ChevronDown,
    Globe,
    HeartPulse,
    Info,
    LayoutGrid,
    Mail,
    Menu,
    Newspaper,
    Phone,
    Plane,
    Search,
    Send,
    Stethoscope,
    X,
} from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';

import { getLocalizedText } from '../../../i18n/getLocalizedText.js';
import flagAz from '../../../assets/azerbaijan.png';
import flagEn from '../../../assets/uk.png';
import flagRu from '../../../assets/circle.png';
import flagAr from '../../../assets/unitedarabemirates.svg';
import logo from '../../../assets/Logo.png';
import CategoriesMenu from '../CategoriesMenu/index.jsx';
import CategoryIcon from '../CategoriesMenu/CategoryIcon.jsx';
import ThemeToggle from '../../ui/ThemeToggle/index.jsx';
import { CONTACT, SOCIAL_LINKS } from '../contactInfo.js';
import {
    useGetAllClinicQuery,
    useGetAllSanatoriumQuery,
    useGetAllToursQuery,
    useGetAllDoctorsQuery,
    useGetAllCategoryQuery,
    useGetAllServiceQuery,
} from '../../../api/userApi.js';
import {
    CLINIC_CARD_IMAGES,
    SANATORIUM_CARD_IMAGES,
    TOUR_CARD_IMG,
    DOCTOR_IMG_URL,
    SERVICE_CARD_IMAGES,
} from '../../../config/mediaUrls.js';

const LANGUAGES = {
    az: { flag: flagAz, label: 'AZ', name: 'Azərbaycan' },
    en: { flag: flagEn, label: 'EN', name: 'English' },
    ru: { flag: flagRu, label: 'RU', name: 'Русский' },
    ar: { flag: flagAr, label: 'AR', name: 'العربية' },
};

const MAIN_NAV_LINKS = [
    { to: '/clinics', key: 'clinics', Icon: Building2 },
    { to: '/germany-clinics', key: 'germanyClinics', Icon: Globe },
    { to: '/sanatoriums', key: 'sanatoriums', Icon: HeartPulse },
    { to: '/doctors', key: 'doctors', Icon: Stethoscope },
    { to: '/tours', key: 'tours', Icon: Plane },
];

const MORE_NAV_LINKS = [
    { to: '/about', key: 'about', Icon: Info },
    { to: '/blogs', key: 'blog', Icon: Newspaper },
    { to: '/contact', key: 'contact', Icon: Send },
];

const MIN_QUERY = 2;

/** Search result thumbnail; falls back to an icon when the image is missing. */
function ResultThumb({ src }) {
    const [failed, setFailed] = useState(false);
    return (
        <span className="nb-result__thumb" aria-hidden="true">
            {src && !failed ? (
                <img src={src} alt="" width="44" height="44" loading="lazy" decoding="async" onError={() => setFailed(true)} />
            ) : (
                <LayoutGrid size={16} strokeWidth={1.75} />
            )}
        </span>
    );
}

const matches = (text, query) => (text || '').toLowerCase().includes(query);

function Navbar() {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const path = location.pathname;

    // Drawer / search remember the path they were opened on, so any route
    // change closes them automatically (no effect needed).
    const [menuPath, setMenuPath] = useState(null);
    const [searchPath, setSearchPath] = useState(null);
    const menuOpen = menuPath === path;
    const searchOpen = searchPath === path;

    const [langOpen, setLangOpen] = useState(false);
    const [moreOpen, setMoreOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const [mobileCatsOpen, setMobileCatsOpen] = useState(false);
    const [openCatId, setOpenCatId] = useState(null);

    // The heavy "get all" queries only run once search (or the drawer) has been opened.
    const [searchRequested, setSearchRequested] = useState(false);
    const [drawerRequested, setDrawerRequested] = useState(false);

    const sentinelRef = useRef(null);
    const langRef = useRef(null);
    const moreRef = useRef(null);
    const searchRef = useRef(null);
    const drawerCloseRef = useRef(null);
    const burgerRef = useRef(null);

    const currentLangKey = Object.keys(LANGUAGES).find((l) => i18n.language?.startsWith(l)) || 'az';
    const currentLang = LANGUAGES[currentLangKey];

    const skipSearch = { skip: !searchRequested };
    const { data: clinicsData } = useGetAllClinicQuery(undefined, skipSearch);
    const { data: sanatoriumsData } = useGetAllSanatoriumQuery(undefined, skipSearch);
    const { data: toursData } = useGetAllToursQuery(undefined, skipSearch);
    const { data: doctorsData } = useGetAllDoctorsQuery(undefined, skipSearch);
    const { data: servicesData } = useGetAllServiceQuery(undefined, skipSearch);
    const { data: categoriesData } = useGetAllCategoryQuery(undefined, {
        skip: !(searchRequested || drawerRequested),
    });

    const query = searchQuery.trim().toLowerCase();
    const hasQuery = query.length >= MIN_QUERY;

    const results = useMemo(() => {
        if (!hasQuery) return null;
        const byName = (list) => (list || []).filter((item) => matches(getLocalizedText(item, 'name'), query));

        const fromServices = byName(servicesData?.data);
        const fromCategories = (categoriesData?.data || [])
            .filter((cat) => matches(getLocalizedText(cat, 'name'), query))
            .flatMap((cat) => cat.services || []);
        const services = [...fromServices, ...fromCategories].filter(
            (svc, index, self) => index === self.findIndex((s) => s.id === svc.id),
        );

        return [
            {
                key: 'clinics',
                title: t('navbar.clinics'),
                type: t('navbar.clinic'),
                items: byName(clinicsData?.data).map((item) => ({
                    id: item.id,
                    to: `/clinics/${item.id}`,
                    name: getLocalizedText(item, 'name'),
                    img: item.clinicCardImage && CLINIC_CARD_IMAGES + item.clinicCardImage,
                })),
            },
            {
                key: 'sanatoriums',
                title: t('navbar.sanatoriums'),
                type: t('navbar.sanatorium'),
                items: byName(sanatoriumsData?.data).map((item) => ({
                    id: item.id,
                    to: `/sanatoriums/${item.id}`,
                    name: getLocalizedText(item, 'name'),
                    img: item.sanatoriumCardImage && SANATORIUM_CARD_IMAGES + item.sanatoriumCardImage,
                })),
            },
            {
                key: 'tours',
                title: t('navbar.tours'),
                type: t('navbar.tour'),
                items: byName(toursData?.data).map((item) => ({
                    id: item.id,
                    to: `/tours/${item.id}`,
                    name: getLocalizedText(item, 'name'),
                    img: item.cardImage && TOUR_CARD_IMG + item.cardImage,
                })),
            },
            {
                key: 'doctors',
                title: t('navbar.doctors'),
                type: t('navbar.doctor'),
                items: (doctorsData?.data || [])
                    .filter((item) =>
                        matches(`${getLocalizedText(item, 'name')} ${getLocalizedText(item, 'surName')}`, query),
                    )
                    .map((item) => ({
                        id: item.id,
                        to: `/doktor/${item.id}`,
                        name: `${getLocalizedText(item, 'name')} ${getLocalizedText(item, 'surName')}`,
                        img: item.doctorImage && DOCTOR_IMG_URL + item.doctorImage,
                    })),
            },
            {
                key: 'services',
                title: t('navbar.services'),
                type: t('navbar.service'),
                items: services.map((item) => ({
                    id: item.id,
                    to: `/category/${item.id}`,
                    name: getLocalizedText(item, 'name'),
                    img: item.serviceCardImage && SERVICE_CARD_IMAGES + item.serviceCardImage,
                })),
            },
        ].filter((group) => group.items.length > 0);
    }, [hasQuery, query, clinicsData, sanatoriumsData, toursData, doctorsData, servicesData, categoriesData, t]);

    const suggested = servicesData?.data?.slice(0, 8) || [];
    const isSearchLoading = searchRequested && !clinicsData && !servicesData;

    /* ---------- open / close helpers ---------- */

    const openSearch = () => {
        setSearchRequested(true);
        setSearchPath(path);
        setLangOpen(false);
        setMoreOpen(false);
    };

    const closeSearch = () => {
        setSearchPath(null);
        setSearchQuery('');
    };

    const openMenu = () => {
        setDrawerRequested(true);
        setMenuPath(path);
        closeSearch();
    };

    const closeMenu = (returnFocus = false) => {
        setMenuPath(null);
        if (returnFocus) burgerRef.current?.focus();
    };

    const changeLang = (key) => {
        i18n.changeLanguage(key);
        try {
            localStorage.setItem('i18nextLng', key);
        } catch {
            /* storage unavailable */
        }
        setLangOpen(false);
    };

    /* ---------- effects ---------- */

    // "Scrolled" styling: a sentinel at the very top of the page leaves the
    // viewport once the user scrolls (IntersectionObserver, no scroll listener).
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el || typeof IntersectionObserver === 'undefined') return undefined;
        const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
        io.observe(el);
        return () => io.disconnect();
    }, []);

    // Outside click closes desktop popovers
    useEffect(() => {
        if (!langOpen && !moreOpen && !searchOpen) return undefined;
        const handler = (e) => {
            if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
            if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchPath(null);
                setSearchQuery('');
            }
        };
        document.addEventListener('pointerdown', handler);
        return () => document.removeEventListener('pointerdown', handler);
    }, [langOpen, moreOpen, searchOpen]);

    // Escape closes whatever is open
    useEffect(() => {
        if (!langOpen && !moreOpen && !searchOpen && !menuOpen) return undefined;
        const onKey = (e) => {
            if (e.key !== 'Escape') return;
            setLangOpen(false);
            setMoreOpen(false);
            setSearchPath(null);
            setSearchQuery('');
            if (menuOpen) {
                setMenuPath(null);
                burgerRef.current?.focus();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [langOpen, moreOpen, searchOpen, menuOpen]);

    // Body scroll lock + initial focus while the drawer is open
    useEffect(() => {
        if (!menuOpen) return undefined;
        const { overflow } = document.body.style;
        document.body.style.overflow = 'hidden';
        drawerCloseRef.current?.focus();
        return () => {
            document.body.style.overflow = overflow;
        };
    }, [menuOpen]);

    const isActive = (to) => path === to || path.startsWith(`${to}/`);
    const moreActive = MORE_NAV_LINKS.some(({ to }) => isActive(to));

    return (
        <>
            <span ref={sentinelRef} className="nb-sentinel" aria-hidden="true" />

            {/* Thin info bar (desktop only) */}
            <div className="nb-topbar">
                <div className="container nb-topbar__inner">
                    <div className="nb-topbar__contacts">
                        <a href={CONTACT.phoneHref}>
                            <Phone size={14} strokeWidth={1.75} aria-hidden="true" />
                            <span dir="ltr">{CONTACT.phoneDisplay}</span>
                        </a>
                        <a href={`mailto:${CONTACT.email}`}>
                            <Mail size={14} strokeWidth={1.75} aria-hidden="true" />
                            <span>{CONTACT.email}</span>
                        </a>
                    </div>
                    <div className="nb-topbar__social">
                        <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><FaWhatsapp aria-hidden="true" /></a>
                        <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram aria-hidden="true" /></a>
                        <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok"><FaTiktok aria-hidden="true" /></a>
                        <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF aria-hidden="true" /></a>
                    </div>
                </div>
            </div>

            <header className={`nb${scrolled ? ' is-scrolled' : ''}`}>
                <div className="container nb-inner">
                    <Link to="/" className="nb-logo" aria-label="Kliniken Allianz">
                        <img src={logo} alt="Kliniken Allianz" width="148" height="50" />
                    </Link>

                    {/* Desktop navigation */}
                    <nav className="nb-nav" aria-label={t('navbar.mainNav', 'Main')}>
                        <CategoriesMenu />
                        {MAIN_NAV_LINKS.map(({ to, key }) => (
                            <NavLink
                                key={key}
                                to={to}
                                className={({ isActive: active }) => `nb-link${active ? ' active' : ''}`}
                            >
                                {t(`navbar.${key}`)}
                            </NavLink>
                        ))}

                        <div className={`nb-more${moreOpen ? ' is-open' : ''}`} ref={moreRef}>
                            <button
                                type="button"
                                className={`nb-link${moreActive ? ' active' : ''}`}
                                aria-haspopup="true"
                                aria-expanded={moreOpen}
                                onClick={() => setMoreOpen((v) => !v)}
                            >
                                {t('navbar.more')}
                                <ChevronDown className="nb-caret" size={15} strokeWidth={1.75} aria-hidden="true" />
                            </button>
                            <ul className="nb-popover nb-more__menu" hidden={!moreOpen}>
                                {MORE_NAV_LINKS.map(({ to, key, Icon }) => (
                                    <li key={key}>
                                        <Link
                                            to={to}
                                            className={`nb-popover__item${isActive(to) ? ' active' : ''}`}
                                            onClick={() => setMoreOpen(false)}
                                        >
                                            <Icon size={17} strokeWidth={1.75} aria-hidden="true" />
                                            {t(`navbar.${key}`)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </nav>

                    <div className="nb-actions">
                        {/* Search */}
                        <div className={`nb-search${searchOpen ? ' is-open' : ''}`} ref={searchRef}>
                            <button
                                type="button"
                                className="nb-icon-btn"
                                onClick={() => (searchOpen ? closeSearch() : openSearch())}
                                aria-label={t('navbar.search')}
                                aria-expanded={searchOpen}
                            >
                                {searchOpen
                                    ? <X size={20} strokeWidth={1.75} aria-hidden="true" />
                                    : <Search size={20} strokeWidth={1.75} aria-hidden="true" />}
                            </button>

                            {searchOpen && (
                                <div className="nb-search__panel" role="dialog" aria-label={t('navbar.search')}>
                                    <div className="nb-search__field">
                                        <Search size={18} strokeWidth={1.75} aria-hidden="true" />
                                        <input
                                            type="search"
                                            name="q"
                                            inputMode="search"
                                            autoComplete="off"
                                            spellCheck={false}
                                            // Opened on demand: focusing the field is the expected next step.
                                            autoFocus
                                            placeholder={t('navbar.searchPlaceholder')}
                                            aria-label={t('navbar.search')}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>

                                    <div className="nb-search__results">
                                        {isSearchLoading && (
                                            <div className="nb-search__skeleton" aria-hidden="true">
                                                <span /><span /><span />
                                            </div>
                                        )}

                                        {hasQuery && results?.length === 0 && !isSearchLoading && (
                                            <p className="nb-search__empty">{t('navbar.noResults')}</p>
                                        )}

                                        {results?.map((group) => (
                                            <div key={group.key} className="nb-search__group">
                                                <p className="nb-search__group-title">{group.title}</p>
                                                <ul>
                                                    {group.items.map((item) => (
                                                        <li key={item.id}>
                                                            <Link to={item.to} className="nb-result" onClick={closeSearch}>
                                                                <ResultThumb src={item.img} />
                                                                <span className="nb-result__info">
                                                                    <span className="nb-result__name">{item.name}</span>
                                                                    <span className="nb-result__type">{group.type}</span>
                                                                </span>
                                                                <ArrowRight className="nb-result__arrow" size={16} strokeWidth={1.75} aria-hidden="true" />
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}

                                        {!hasQuery && suggested.length > 0 && (
                                            <div className="nb-search__suggested">
                                                <p className="nb-search__group-title">{t('navbar.suggestedServices')}</p>
                                                <div className="nb-chips">
                                                    {suggested.map((item) => (
                                                        <Link
                                                            key={item.id}
                                                            to={`/category/${item.id}`}
                                                            className="nb-chip"
                                                            onClick={closeSearch}
                                                        >
                                                            {getLocalizedText(item, 'name')}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Language (desktop / tablet) */}
                        <div className={`nb-lang${langOpen ? ' is-open' : ''}`} ref={langRef}>
                            <button
                                type="button"
                                className="nb-lang__btn"
                                aria-haspopup="listbox"
                                aria-expanded={langOpen}
                                aria-label={`${t('navbar.languages.' + currentLangKey, currentLang.name)}`}
                                onClick={() => {
                                    setLangOpen((v) => !v);
                                    setMoreOpen(false);
                                }}
                            >
                                <img src={currentLang.flag} alt="" width="22" height="22" />
                                <span>{currentLang.label}</span>
                                <ChevronDown className="nb-caret" size={15} strokeWidth={1.75} aria-hidden="true" />
                            </button>
                            <ul className="nb-popover nb-lang__menu" role="listbox" hidden={!langOpen}>
                                {Object.entries(LANGUAGES).map(([key, lang]) => (
                                    <li key={key} role="none">
                                        <button
                                            type="button"
                                            role="option"
                                            aria-selected={currentLangKey === key}
                                            lang={key}
                                            className={`nb-popover__item${currentLangKey === key ? ' active' : ''}`}
                                            onClick={() => changeLang(key)}
                                        >
                                            <img src={lang.flag} alt="" width="20" height="20" />
                                            <span>{lang.name}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <ThemeToggle className="nb-theme" />

                        <Link to="/contact" className="btn btn--primary btn--sm nb-cta">
                            {t('navbar.contact')}
                            <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
                        </Link>

                        <button
                            ref={burgerRef}
                            type="button"
                            className="nb-icon-btn nb-burger"
                            onClick={() => (menuOpen ? closeMenu() : openMenu())}
                            aria-label={t('navbar.menu', 'Menu')}
                            aria-expanded={menuOpen}
                            aria-controls="nb-drawer"
                        >
                            <Menu size={22} strokeWidth={1.75} aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile drawer */}
            <div className={`nb-overlay${menuOpen ? ' is-open' : ''}`} onClick={() => closeMenu()} aria-hidden="true" />
            <aside
                id="nb-drawer"
                className={`nb-drawer${menuOpen ? ' is-open' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-label={t('navbar.menu', 'Menu')}
                aria-hidden={!menuOpen}
                inert={!menuOpen}
            >
                <div className="nb-drawer__head">
                    <Link to="/" className="nb-logo" onClick={() => closeMenu()}>
                        <img src={logo} alt="Kliniken Allianz" width="118" height="40" />
                    </Link>
                    <button
                        ref={drawerCloseRef}
                        type="button"
                        className="nb-icon-btn"
                        onClick={() => closeMenu(true)}
                        aria-label={t('common.close', 'Close')}
                    >
                        <X size={22} strokeWidth={1.75} aria-hidden="true" />
                    </button>
                </div>

                <div className="nb-drawer__body">
                    <nav aria-label={t('navbar.mainNav', 'Main')}>
                        <ul className="nb-drawer__list">
                            {/* Categories accordion */}
                            <li>
                                <button
                                    type="button"
                                    className={`nb-drawer__item${mobileCatsOpen ? ' is-expanded' : ''}`}
                                    aria-expanded={mobileCatsOpen}
                                    onClick={() => setMobileCatsOpen((v) => !v)}
                                >
                                    <span className="nb-drawer__icon" aria-hidden="true"><LayoutGrid size={18} strokeWidth={1.75} /></span>
                                    <span className="nb-drawer__label">{t('categoriesMenu.title')}</span>
                                    <ChevronDown className="nb-caret" size={18} strokeWidth={1.75} aria-hidden="true" />
                                </button>
                                {mobileCatsOpen && (
                                    <ul className="nb-drawer__cats">
                                        {!categoriesData && (
                                            <li className="nb-search__skeleton" aria-hidden="true"><span /><span /></li>
                                        )}
                                        {categoriesData?.data?.map((cat) => {
                                            const expanded = openCatId === cat.id;
                                            return (
                                                <li key={cat.id}>
                                                    <button
                                                        type="button"
                                                        className={`nb-drawer__cat${expanded ? ' is-expanded' : ''}`}
                                                        aria-expanded={expanded}
                                                        onClick={() => setOpenCatId(expanded ? null : cat.id)}
                                                    >
                                                        <span className="nb-drawer__cat-icon" aria-hidden="true">
                                                            <CategoryIcon file={cat.categoryImage} size={16} iconSize={14} />
                                                        </span>
                                                        <span className="nb-drawer__label">{getLocalizedText(cat, 'name')}</span>
                                                        {cat.services?.length > 0 && (
                                                            <ChevronDown className="nb-caret" size={16} strokeWidth={1.75} aria-hidden="true" />
                                                        )}
                                                    </button>
                                                    {expanded && cat.services?.length > 0 && (
                                                        <ul className="nb-drawer__services">
                                                            {cat.services.map((service) => (
                                                                <li key={service.id}>
                                                                    <Link to={`/category/${service.id}`} onClick={() => closeMenu()}>
                                                                        {getLocalizedText(service, 'name')}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </li>

                            {[...MAIN_NAV_LINKS, ...MORE_NAV_LINKS].map(({ to, key, Icon }) => (
                                <li key={key}>
                                    <Link
                                        to={to}
                                        className={`nb-drawer__item${isActive(to) ? ' active' : ''}`}
                                        aria-current={isActive(to) ? 'page' : undefined}
                                        onClick={() => closeMenu()}
                                    >
                                        <span className="nb-drawer__icon" aria-hidden="true"><Icon size={18} strokeWidth={1.75} /></span>
                                        <span className="nb-drawer__label">{t(`navbar.${key}`)}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="nb-drawer__langs" role="group" aria-label={t('navbar.language', 'Language')}>
                        {Object.entries(LANGUAGES).map(([key, lang]) => (
                            <button
                                key={key}
                                type="button"
                                lang={key}
                                className={`nb-drawer__lang${currentLangKey === key ? ' active' : ''}`}
                                aria-pressed={currentLangKey === key}
                                onClick={() => changeLang(key)}
                            >
                                <img src={lang.flag} alt="" width="18" height="18" />
                                <span>{lang.label}</span>
                            </button>
                        ))}
                    </div>

                    <ThemeToggle className="nb-drawer__theme" showLabel />
                </div>

                <div className="nb-drawer__foot">
                    <a href={CONTACT.phoneHref} className="nb-drawer__contact">
                        <Phone size={18} strokeWidth={1.75} aria-hidden="true" />
                        <span dir="ltr">{CONTACT.phoneDisplay}</span>
                    </a>
                    <Link to="/contact" className="btn btn--primary btn--block" onClick={() => closeMenu()}>
                        {t('navbar.contact')}
                        <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
                    </Link>
                </div>
            </aside>
        </>
    );
}

export default Navbar;
