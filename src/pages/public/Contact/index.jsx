import { useTranslation } from "react-i18next";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { usePostContactMutation } from "../../../api/userApi.js";
import PageHeader from "../../../components/ui/PageHeader/index.jsx";
import EnquiryForm from "./EnquiryForm.jsx";
import "./index.scss";

const MAP_SRC =
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6075.457541085724!2d49.8586237!3d40.414859!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x403087fef0e167f9%3A0x2d47dbedc1eea9e7!2sChinar%20Park!5e0!3m2!1saz!2saz!4v1763456109814!5m2!1saz!2saz";

function Contact() {
    const { t } = useTranslation();
    const [postContact] = usePostContactMutation();

    const phone = t("contact.contactCard.mobile.value");
    const email = t("contact.contactCard.email.value");

    const channels = [
        {
            key: "phone",
            icon: Phone,
            title: t("contact.contactCard.mobile.title"),
            value: phone,
            href: `tel:${phone.replace(/\s+/g, "")}`,
            ltr: true,
        },
        {
            key: "email",
            icon: Mail,
            title: t("contact.contactCard.email.title"),
            value: email,
            href: `mailto:${email}`,
            ltr: true,
        },
        {
            key: "address",
            icon: MapPin,
            title: t("contact.contactCard.address.title"),
            value: t("contact.contactCard.address.value"),
            href: "https://maps.google.com/?q=Chinar+Park+Business+Center+Baku",
            external: true,
        },
    ];

    return (
        <div className="contact-page">
            <PageHeader
                title={t("contact.title")}
                subtitle={t("contact.main.desc")}
                crumbs={[{ label: t("contact.breadcrumb.contact") }]}
            />

            <section className="section contact-page__body" aria-labelledby="contact-info-title">
                <div className="container contact-page__grid">
                    <div className="contact-page__info" data-reveal>
                        <h2 id="contact-info-title">{t("contact.main.title")}</h2>
                        <p className="contact-page__lead">
                            {t(
                                "contact.lead",
                                "Call, write or visit us. A coordinator will answer your questions about clinics, treatment and travel."
                            )}
                        </p>

                        <ul className="contact-channels">
                            {channels.map(({ key, icon: Icon, title, value, href, ltr, external }) => (
                                <li key={key}>
                                    <a
                                        className="contact-channel"
                                        href={href}
                                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                    >
                                        <span className="contact-channel__icon">
                                            <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                                        </span>
                                        <span className="contact-channel__text">
                                            <span className="contact-channel__label">{title}</span>
                                            <span className="contact-channel__value" dir={ltr ? "ltr" : undefined} translate="no">
                                                {value}
                                            </span>
                                        </span>
                                        <ArrowUpRight
                                            size={18}
                                            strokeWidth={1.75}
                                            className="contact-channel__arrow"
                                            aria-hidden="true"
                                        />
                                    </a>
                                </li>
                            ))}
                        </ul>

                        <div className="contact-page__map">
                            <iframe
                                src={MAP_SRC}
                                title={t("contact.mapTitle", "Office location on Google Maps")}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                allowFullScreen
                            />
                        </div>
                    </div>

                    <div className="contact-page__form">
                        <EnquiryForm
                            title={t("contact.form.title")}
                            onSubmit={(values) => postContact(values).unwrap()}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Contact;
