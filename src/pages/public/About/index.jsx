import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    ArrowRight, BadgeCheck, Check, Globe2, Handshake, HeartPulse, Languages, MessageCircle, Plane, Quote, Receipt, Stethoscope, TreePalm,
} from "lucide-react";
import { useGetAllCategoryQuery, useGetAllSanatoriumQuery, useGetAllToursQuery } from "../../../api/userApi.js";
import PageHeader from "../../../components/ui/PageHeader/index.jsx";
import SectionTitle from "../../../components/ui/SectionTitle/index.jsx";
import CtaBand from "../Contact/CtaBand.jsx";
import storyImage from "../../../assets/AboutFirst.png";
import "./index.scss";

function AboutUs() {
    const { t } = useTranslation();
    const { data: categories } = useGetAllCategoryQuery();
    const { data: sanatoriums } = useGetAllSanatoriumQuery();
    const { data: tours } = useGetAllToursQuery();

    const count = (res) => (Array.isArray(res?.data) ? res.data.length : null);
    const stats = [
        { key: "specialities", icon: Stethoscope, value: count(categories), label: t("aboutUs.stats.specialities", "Medical specialities") },
        { key: "sanatoriums", icon: HeartPulse, value: count(sanatoriums), label: t("aboutUs.stats.sanatoriums", "Partner sanatoriums") },
        { key: "tours", icon: TreePalm, value: count(tours), label: t("aboutUs.stats.tours", "Tour packages") },
        { key: "languages", icon: Languages, value: 4, label: t("aboutUs.stats.languages", "Languages we speak") },
    ];

    const values = [
        { key: "consultation", icon: MessageCircle },
        { key: "partnership", icon: Handshake },
        { key: "travel", icon: Plane },
        { key: "pricing", icon: Receipt },
    ];

    const servicesList = t("aboutUs.servicesList", { returnObjects: true });
    const services = Array.isArray(servicesList) ? servicesList : [];

    return (
        <div className="about-page">
            <PageHeader
                title={t("aboutUs.pageTitle")}
                subtitle={t("aboutUs.section1.desc")}
                crumbs={[{ label: t("aboutUs.pageTitle") }]}
            />

            {/* Story */}
            <section className="section">
                <div className="container about-story">
                    <div className="about-story__text">
                        <span className="eyebrow">{t("aboutUs.eyebrow", "Who we are")}</span>
                        <h2>{t("aboutUs.section1.title")}</h2>
                        <p>{t("aboutUs.details.p1")}</p>
                        <p>{t("aboutUs.details.p2")}</p>
                        <div className="about-story__actions">
                            <Link to="/contact" className="btn btn--primary">
                                {t("aboutUs.section1.button")}
                                <ArrowRight size={18} strokeWidth={2} className="about-page__arrow" aria-hidden="true" />
                            </Link>
                            <Link to="/clinics" className="btn btn--secondary">
                                {t("navbar.clinics")}
                            </Link>
                        </div>
                    </div>
                    <div className="about-story__media">
                        <img src={storyImage} alt={t("aboutUs.bannerAlt")} loading="lazy" decoding="async" width="517" height="578" />
                        <div className="about-story__badge">
                            <span className="about-story__badge-icon"><Globe2 size={20} strokeWidth={2} /></span>
                            <span>
                                <strong>{t("aboutUs.badge.title", "Official office in Germany")}</strong>
                                <small>{t("aboutUs.badge.text", "Plus partner clinics across Azerbaijan")}</small>
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="about-stats-wrap">
                <div className="container">
                    <ul className="about-stats">
                        {stats.map(({ key, icon: Icon, value, label }) => (
                            <li key={key}>
                                <span className="about-stats__icon"><Icon size={22} strokeWidth={1.75} aria-hidden="true" /></span>
                                <strong>{value == null ? "—" : value}</strong>
                                <span>{label}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Values */}
            <section className="section">
                <div className="container">
                    <SectionTitle
                        eyebrow={t("aboutUs.valuesEyebrow", "Why choose us")}
                        title={t("aboutUs.section2.title")}
                        desc={t("aboutUs.section2.desc")}
                    />
                    <ul className="about-values">
                        {values.map(({ key, icon: Icon }) => (
                            <li className="about-value" key={key}>
                                <span className="about-value__icon"><Icon size={24} strokeWidth={1.75} aria-hidden="true" /></span>
                                <h3>{t(`aboutUs.section2.cards.${key}.title`)}</h3>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Full service package */}
            <section className="section section--subtle">
                <div className="container about-service">
                    <div className="about-service__intro">
                        <span className="eyebrow">{t("aboutUs.serviceEyebrow", "Full service package")}</span>
                        <h2>{t("aboutUs.serviceTitle", "From the first consultation to your return home")}</h2>
                        <p>{t("aboutUs.details.p4")}</p>
                        <p>{t("aboutUs.details.p3")}</p>
                    </div>
                    <ul className="about-service__list">
                        {services.map((service, i) => (
                            <li key={i}>
                                <span className="about-service__check"><Check size={14} strokeWidth={3} aria-hidden="true" /></span>
                                <span>{service}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Promise */}
            <section className="section">
                <div className="container">
                    <figure className="about-quote">
                        <Quote size={36} strokeWidth={1.5} className="about-quote__mark" aria-hidden="true" />
                        <blockquote>
                            <p>{t("aboutUs.details.p5")}</p>
                        </blockquote>
                        <figcaption>
                            <BadgeCheck size={18} strokeWidth={2} aria-hidden="true" />
                            {t("aboutUs.details.p6")}
                        </figcaption>
                    </figure>
                </div>
            </section>

            <CtaBand />
        </div>
    );
}

export default AboutUs;
