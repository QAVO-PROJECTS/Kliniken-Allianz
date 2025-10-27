import { useState } from "react";
import "./index.scss";

export default function CategoriesMenuCustom() {
    const [hovered, setHovered] = useState(null);

    const categories = [
        {
            name: "Xərçəng müalicəsi",
            sub: [
                "Süd vəzi xərçəngi",
                "Ağciyər xərçəngi",
                "Qalın bağırsaq xərçəngi",
                "Mədə xərçəngi",
                "Qaraciyər xərçəngi",
                "Prostat xərçəngi",
                "Dəri xərçəngi",
                "Baş və boyun xərçəngi",
                "Yumurtalıq və uşaqlıq xərçəngi",
                "Qan və limfa sistemi",
            ],
        },
        { name: "Ginekologiya", sub: [] },
        { name: "Kardiologiya", sub: [] },
        { name: "Ortopediya", sub: [] },
    ];

    return (
        <div className="categories-menu">
            <ul className="main-menu">
                {categories.map((cat, i) => (
                    <li
                        key={i}
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                    >
                        {cat.name}
                        {cat.sub.length > 0 && (
                            <ul className={`submenu ${hovered === i ? "show" : ""}`}>
                                {cat.sub.map((sub, j) => (
                                    <li key={j}>{sub}</li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
