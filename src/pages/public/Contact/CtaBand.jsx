import { useId } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import "./ctaBand.scss";

/**
 * Navy closing call-to-action band for travel / content pages. Visually the same
 * as Clinics/shared/CtaBand (gradient-brand, radius-xl, one white button) and it
 * uses the site-wide contact label (navbar.contact) so the intent has one name.
 */
function CtaBand({ title, text }) {
    const { t } = useTranslation();
    const titleId = useId();

    return (
        <section className="cta-band-section" aria-labelledby={titleId}>
            <div className="container">
                <div className="cta-band" data-reveal>
                    <div className="cta-band__text">
                        <h2 id={titleId}>{title || t("ctaBand.title", "Ready to plan your treatment journey?")}</h2>
                        <p>
                            {text ||
                                t(
                                    "ctaBand.desc",
                                    "Tell us what you need. Our coordinators will prepare a personal plan with clinics, travel and accommodation."
                                )}
                        </p>
                    </div>
                    <Link to="/contact" className="btn btn--lg cta-band__btn">
                        {t("navbar.contact")}
                        <ArrowRight size={18} strokeWidth={1.75} className="cta-band__arrow" aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default CtaBand;
