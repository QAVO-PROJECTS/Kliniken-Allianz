import React from "react";
import { Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import "./index.scss";
import rightIcon from "/src/assets/rigthIcon.svg";
import { useGetAllCategoryQuery } from "../../services/userApi.jsx";
import {CATEGORY_IMAGES} from "../../contants.js";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

export default function CategoriesMenuAntd() {
    const { data: getAllCategory } = useGetAllCategoryQuery();
    const categories = getAllCategory?.data || [];
    const {t} = useTranslation();
    const navigate = useNavigate();

    const mainMenu = (
        <Menu
            items={categories.map((category) => {
                const hasServices = category.services && category.services.length > 0;

                const content = (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "40px",
                            minWidth: "230px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                            }}
                        >
                            {category.categoryImage && (
                                <img
                                    src={CATEGORY_IMAGES+category.categoryImage}
                                    alt={category.name}
                                    style={{
                                        width: "22px",
                                        height: "22px",
                                        borderRadius: "4px",
                                        objectFit: "cover",
                                    }}
                                />
                            )}
                            <span>{category.name}</span>
                        </div>
                        {hasServices && <img src={rightIcon} alt=">" />}
                    </div>
                );

                return {
                    key: category.id,
                    label: hasServices ? (
                        <Dropdown
                            overlay={
                                <Menu
                                    items={category.services.map((service) => ({
                                        key: service.id,
                                        label: (
                                            <div onClick={() => navigate(`/category/${service.id}`)}>
                                                {service.name}
                                            </div>
                                        ),
                                    }))}
                                />
                            }
                            placement="rightTop"
                            trigger={["hover"]}
                        >
                            {/* 🧩 burada yalnız *bir* element var, səhv çıxmayacaq */}
                            <div>{content}</div>
                        </Dropdown>
                    ) : (
                        <div>{content}</div>
                    ),
                };
            })}
        />
    );

    return (
        <Dropdown overlay={mainMenu} trigger={["hover"]}>
            <a
                onClick={(e) => e.preventDefault()}
                style={{
                    color: "#5f5f5f",
                    fontWeight: 500,
                    fontSize: "16px",
                    margin: "0 20px",
                }}
            >
                {t("categoriesMenu.title")}
            </a>
        </Dropdown>
    );
}
