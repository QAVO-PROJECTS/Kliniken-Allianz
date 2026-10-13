import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    ArrowRight, Check, Globe2, Handshake, HeartPulse, Languages, MessageCircle, Plane, Receipt, Stethoscope, TreePalm,
} from "lucide-react";
import { useGetAllCategoryQuery, useGetAllSanatoriumQuery, useGetAllToursQuery } from "../../../api/userApi.js";
import PageHeader from "../../../components/ui/PageHeader/index.jsx";
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

            {/* Story: text + photo */}
            <section className="section" aria-labelledby="about-story-title">
                <div className="container about-story">
                    <div className="about-story__text" data-reveal>
                        <span className="eyebrow">{t("aboutUs.eyebrow", "Who we are")}</span>
                        <h2 id="about-story-title">{t("aboutUs.section1.title")}</h2>
                        <p>{t("aboutUs.details.p1")}</p>
                        <p>{t("aboutUs.details.p2")}</p>
                        <div className="about-story__office">
                            <span className="about-story__office-icon">
                                <Globe2 size={20} strokeWidth={1.75} aria-hidden="true" />
                            </span>
                            <span>
                                <strong>{t("aboutUs.badge.title", "Official office in Germany")}</strong>
                                <small>{t("aboutUs.badge.text", "Plus partner clinics across Azerbaijan")}</small>
                            </span>
                        </div>
                        <div className="about-story__actions">
                            <Link to="/contact" className="btn btn--primary">
                                {t("navbar.contact")}
                                <ArrowRight size={18} strokeWidth={1.75} className="about-page__arrow" aria-hidden="true" />
                            </Link>
                            <Link to="/clinics" className="btn btn--secondary">
                                {t("navbar.clinics")}
                            </Link>
                        </div>
                    </div>
                    <div className="about-story__media" data-reveal style={{ "--reveal-delay": "120ms" }}>
                        <img src={storyImage} alt={t("aboutUs.bannerAlt")} loading="lazy" decoding="async" width="517" height="578" />
                    </div>
                </div>
            </section>

            {/* Figures: one quiet row of numbers */}
            <section className="about-stats-wrap">
                <div className="container">
                    <dl className="about-stats" data-reveal>
                        {stats.map(({ key, icon: Icon, value, label }) => (
                            <div className="about-stats__item" key={key}>
                                <dt>
                                    <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                                    {label}
                                </dt>
                                <dd>
                                    {value == null ? (
                                        <span className="skeleton about-stats__placeholder" aria-hidden="true" />
                                    ) : (
                                        value
                                    )}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            {/* Why us: heading + list of reasons */}
            <section className="section" aria-labelledby="about-values-title">
                <div className="container about-values">
                    <div className="about-values__head" data-reveal>
                        <h2 id="about-values-title">{t("aboutUs.section2.title")}</h2>
                        <p>{t("aboutUs.section2.desc")}</p>
                    </div>
                    <ul className="about-values__list" data-reveal style={{ "--reveal-delay": "120ms" }}>
                        {values.map(({ key, icon: Icon }) => (
                            <li key={key}>
                                <span className="about-values__icon">
                                    <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                                </span>
                                <h3>{t(`aboutUs.section2.cards.${key}.title`)}</h3>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Full service package: stacked heading, grouped check grid, check-up note */}
            <section className="section section--subtle" aria-labelledby="about-service-title">
                <div className="container about-service">
                    <div className="about-service__intro" data-reveal>
                        <h2 id="about-service-title">{t("aboutUs.serviceTitle", "From the first consultation to your return home")}</h2>
                        <p>{t("aboutUs.details.p4")}</p>
                    </div>
                    <ol className="about-service__list" data-reveal>
                        {services.map((service, i) => (
                            <li key={i}>
                                <span className="about-service__check">
                                    <Check size={16} strokeWidth={1.75} aria-hidden="true" />
                                </span>
                                <span>{service}</span>
                            </li>
                        ))}
                    </ol>
                    <p className="about-service__note" data-reveal>
                        <Stethoscope size={20} strokeWidth={1.75} aria-hidden="true" />
                        <span>{t("aboutUs.details.p3")}</span>
                    </p>
                </div>
            </section>

            {/* Promise: short pull quote + supporting paragraph */}
            <section className="section">
                <div className="container">
                    <figure className="about-quote" data-reveal>
                        <blockquote>
                            <p>{t("aboutUs.details.p6")}</p>
                        </blockquote>
                        <figcaption translate="no">Kliniken Allianz</figcaption>
                        <p className="about-quote__support">{t("aboutUs.details.p5")}</p>
                    </figure>
                </div>
            </section>

            <CtaBand />
        </div>
    );
}

export default AboutUs;
