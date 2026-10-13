import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import "./shared.scss";

/**
 * Navy call-to-action band at the end of listing pages. The button uses the
 * site-wide contact label (navbar.contact) so the contact intent has one name.
 */
function CtaBand() {
    const { t } = useTranslation();
    return (
        <section className="md-cta" aria-labelledby="md-cta-title">
            <div className="container">
                <div className="md-cta__inner" data-reveal>
                    <div className="md-cta__text">
                        <h2 id="md-cta-title">{t("aboutUs.section1.title")}</h2>
                        <p>{t("aboutUs.section1.desc")}</p>
                    </div>
                    <Link to="/contact" className="btn btn--lg md-cta__btn">
                        {t("navbar.contact")}
                        <ArrowRight size={18} strokeWidth={1.75} className="md-flip-rtl" aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default CtaBand;
