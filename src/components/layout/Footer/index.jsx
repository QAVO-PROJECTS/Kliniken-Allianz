import './index.scss';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Mail, MessageCircle, Phone } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import logo from '../../../assets/FootLogo.png';
import { CONTACT, SOCIAL_LINKS } from '../contactInfo.js';

const PRIMARY_LINKS = [
    { to: '/clinics', key: 'clinics' },
    { to: '/germany-clinics', key: 'germanyClinics' },
    { to: '/sanatoriums', key: 'sanatoriums' },
    { to: '/doctors', key: 'doctors' },
    { to: '/tours', key: 'tours' },
];

const SECONDARY_LINKS = [
    { to: '/about', key: 'about' },
    { to: '/blogs', key: 'blog' },
    { to: '/contact', key: 'contact' },
];

const SOCIALS = [
    { href: SOCIAL_LINKS.whatsapp, label: 'WhatsApp', Icon: FaWhatsapp },
    { href: SOCIAL_LINKS.instagram, label: 'Instagram', Icon: FaInstagram },
    { href: SOCIAL_LINKS.tiktok, label: 'TikTok', Icon: FaTiktok },
    { href: SOCIAL_LINKS.facebook, label: 'Facebook', Icon: FaFacebookF },
];

function Footer() {
    const { t } = useTranslation();
    const year = new Date().getFullYear();
    // The translated copyright line contains a hard-coded year — keep it current.
    const copyright = t('footer.copyright').replace(/\b(19|20)\d{2}\b/, String(year));

    return (
        <footer className="site-footer">
            <div className="container">
                <div className="site-footer__grid">
                    <div className="site-footer__brand">
                        <Link to="/" className="site-footer__logo" aria-label="Kliniken Allianz">
                            <img src={logo} alt={t('footer.logoAlt')} width="180" height="61" loading="lazy" decoding="async" />
                        </Link>
                        <p className="site-footer__desc">{t('footer.description')}</p>
                        <ul className="site-footer__social" aria-label="Social media">
                            {SOCIALS.map(({ href, label, Icon }) => (
                                <li key={label}>
                                    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                                        <Icon aria-hidden="true" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <nav className="site-footer__col site-footer__col--links" aria-label={t('footer.links')}>
                        <h3 className="site-footer__title">{t('footer.links')}</h3>
                        <ul className="site-footer__links">
                            {[...PRIMARY_LINKS, ...SECONDARY_LINKS].map(({ to, key }) => (
                                <li key={key}>
                                    <Link to={to}>{t(`navbar.${key}`)}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="site-footer__col">
                        <h3 className="site-footer__title">{t('footer.contactTitle')}</h3>
                        <ul className="site-footer__contacts">
                            <li>
                                <a href={CONTACT.phoneHref} className="site-footer__contact">
                                    <span className="site-footer__contact-icon"><Phone size={18} strokeWidth={1.9} aria-hidden="true" /></span>
                                    <span>
                                        <span className="site-footer__contact-label">{t('footer.call')}</span>
                                        <span className="site-footer__contact-value" dir="ltr">{CONTACT.phoneDisplay}</span>
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href={`mailto:${CONTACT.email}`} className="site-footer__contact">
                                    <span className="site-footer__contact-icon"><Mail size={18} strokeWidth={1.9} aria-hidden="true" /></span>
                                    <span>
                                        <span className="site-footer__contact-label">{t('footer.mail')}</span>
                                        <span className="site-footer__contact-value">{CONTACT.email}</span>
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="site-footer__contact">
                                    <span className="site-footer__contact-icon"><MessageCircle size={18} strokeWidth={1.9} aria-hidden="true" /></span>
                                    <span>
                                        <span className="site-footer__contact-label">WhatsApp</span>
                                        <span className="site-footer__contact-value" dir="ltr">{CONTACT.phoneDisplay}</span>
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="site-footer__bottom">
                    <p>{copyright}</p>
                    <p>
                        {t('footer.createdBy')}{' '}
                        <a href="https://buyontech.net/" target="_blank" rel="noopener noreferrer">
                            BuyonTech
                            <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
