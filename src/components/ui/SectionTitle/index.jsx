import './index.scss'

/**
 * Section heading. `align` is "center" (default) or "start".
 * `eyebrow` is optional and renders as a quiet label; pages decide whether a
 * section needs one (taste rule: at most one per three sections).
 */
function SectionTitle({ title, desc, eyebrow, align = "center", className = "" }) {
    return (
        <div className={`section-title section-title--${align} ${className}`.trim()}>
            {eyebrow && <span className="eyebrow section-title__eyebrow">{eyebrow}</span>}
            <h2>{title}</h2>
            {desc && <p>{desc}</p>}
        </div>
    );
}

export default SectionTitle;
