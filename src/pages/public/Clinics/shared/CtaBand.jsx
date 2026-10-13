import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, HeartPulse } from "lucide-react";
import "./shared.scss";

/** Brand-gradient call-to-action band placed at the end of listing pages. */
function CtaBand() {
    const { t } = useTranslation();
    return (
        <section className="md-cta" aria-labelledby="md-cta-title">
            <div className="container">
                <div className="md-cta__inner">
                    <span className="md-cta__icon" aria-hidden="true">
                        <HeartPulse size={28} strokeWidth={1.75} />
                    </span>
                    <div className="md-cta__text">
                        <h2 id="md-cta-title">{t("aboutUs.section1.title")}</h2>
                        <p>{t("aboutUs.section1.desc")}</p>
                    </div>
                    <Link to="/contact" className="btn btn--light btn--lg md-cta__btn">
                        {t("aboutUs.section1.button")}
                        <ArrowRight size={18} className="md-flip-rtl" aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default CtaBand;
