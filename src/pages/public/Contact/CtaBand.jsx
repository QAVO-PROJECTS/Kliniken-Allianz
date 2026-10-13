import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Phone } from "lucide-react";
import "./ctaBand.scss";

/** Closing call-to-action band used at the bottom of public pages. */
function CtaBand({ title, text, showContactButton = true }) {
    const { t } = useTranslation();
    const phone = t("contact.contactCard.mobile.value");

    return (
        <section className="cta-band-section">
            <div className="container">
                <div className="cta-band">
                    <div className="cta-band__text">
                        <h2>{title || t("ctaBand.title", "Ready to plan your treatment journey?")}</h2>
                        <p>
                            {text ||
                                t(
                                    "ctaBand.desc",
                                    "Tell us what you need — our coordinators will prepare a personalised plan with clinics, travel and accommodation."
                                )}
                        </p>
                    </div>
                    <div className="cta-band__actions">
                        {showContactButton && (
                            <Link to="/contact" className="btn btn--light btn--lg">
                                {t("ctaBand.button", "Get a free consultation")}
                                <ArrowRight size={18} strokeWidth={2} className="cta-band__arrow" aria-hidden="true" />
                            </Link>
                        )}
                        <a href={`tel:${phone.replace(/\s+/g, "")}`} className="cta-band__phone">
                            <Phone size={16} strokeWidth={2} aria-hidden="true" />
                            <span dir="ltr">{phone}</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CtaBand;
