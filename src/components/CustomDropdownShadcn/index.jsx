import React, {useState} from "react";
import { Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import "./index.scss";
import rightIcon from "/src/assets/rigthIcon.svg";
import { useGetAllCategoryQuery } from "../../services/userApi.jsx";
import {CATEGORY_IMAGES} from "../../contants.js";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {FaChevronDown} from "react-icons/fa";

export default function CategoriesMenuAntd() {
    const { data: getAllCategory } = useGetAllCategoryQuery();
    const categories = getAllCategory?.data || [];
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [hoveredCategory, setHoveredCategory] = useState(null);

    const hoveredData = categories.find(c => c.id === hoveredCategory);

    const mainMenu = (
        <div style={{ display: "flex", borderRadius: "10px", overflow: "hidden", boxShadow: "0 6px 24px rgba(0,0,0,0.12)" }}>
            {/* Sol - Kateqoriyalar */}
            <div style={{
                width: "260px",
                maxHeight: "500px",
                overflowY: "auto",
                background: "white",
                padding: "6px",
                scrollbarWidth: "thin",
                scrollbarColor: "#003778 #f1f1f1",
            }}>
                {categories.map((category) => (
                    <div
                        key={category.id}
                        onMouseEnter={() => setHoveredCategory(category.id)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            backgroundColor: hoveredCategory === category.id ? "#f4f8ff" : "transparent",
                            color: hoveredCategory === category.id ? "#003778" : "#333",
                            transition: "all 0.2s ease",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            {category.categoryImage && (
                                <img
                                    src={CATEGORY_IMAGES + category.categoryImage}
                                    alt={category.name}
                                    style={{ width: "22px", height: "22px", objectFit: "cover", borderRadius: "4px" }}
                                />
                            )}
                            <span style={{ fontSize: "14px", fontWeight: 500 }}>{category.name}</span>
                        </div>
                        {category.services?.length > 0 && (
                            <img src={rightIcon} alt=">" style={{ width: "16px" }} />
                        )}
                    </div>
                ))}
            </div>

            {/* Sağ - Xidmətlər */}
            {hoveredData?.services?.length > 0 && (
                <div style={{
                    width: "220px",
                    maxHeight: "500px",
                    overflowY: "auto",
                    background: "#f9fbff",
                    borderLeft: "1px solid #e8f0fe",
                    padding: "6px",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#003778 #f1f1f1",
                }}>
                    {hoveredData.services.map((service) => (
                        <div
                            key={service.id}
                            onClick={() => navigate(`/category/${service.id}`)}
                            style={{
                                padding: "8px 16px",
                                fontSize: "14px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                color: "#333",
                                transition: "all 0.2s ease",
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = "#e8f0fe";
                                e.currentTarget.style.color = "#003778";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = "#333";
                            }}
                        >
                            {service.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <Dropdown
            overlay={mainMenu}
            trigger={["hover"]}
            placement="bottomLeft"
            autoAdjustOverflow={false}
        >
           <a onClick={(e) => e.preventDefault()}
            style={{
            color: "#5f5f5f",
            fontWeight: 500,
            fontSize: "16px",
            margin: "0 20px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer",
            textDecoration: "none",
        }}
            >
            {t("categoriesMenu.title")} <FaChevronDown style={{ fontSize: "12px", color: "#838383" }} />
        </a>
</Dropdown>
);
}
