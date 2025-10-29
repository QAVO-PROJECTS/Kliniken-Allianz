import React from "react";
import { Menu, Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import "./index.scss"
import icon from '/src/assets/icon1.png'
import rightIcon from "/src/assets/rigthIcon.svg"
const cancerSubMenu = (
    <Menu
        items={[
            { key: "1", label: "Süd vəzi xərçəngi" },
            { key: "2", label: "Ağciyər xərçəngi" },
            { key: "3", label: "Qalın bağırsaq xərçəngi" },
            { key: "4", label: "Mədə xərçəngi" },
            { key: "5", label: "Qaraciyər xərçəngi" },
            { key: "6", label: "Prostat xərçəngi" },
            { key: "7", label: "Dəri xərçəngi" },
            { key: "8", label: "Baş və boyun xərçəngi" },
            { key: "9", label: "Yumurtalıq və uşaqlıq xərçəngi" },
            { key: "10", label: "Qan və limfa sistemi" },
        ]}
    />
);

const mainMenu = (
    <Menu
        items={[
            {
                key: "cancer",
                label: (
                    <Dropdown overlay={cancerSubMenu} placement="rightTop" trigger={["hover"]}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap:"60px"
                        }}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap:"12px"
                            }}>
                                <img src={icon} alt="" style={{
                                    width:"20px",
                                    height:"20px",
                                }}/>
                                <a href="#" onClick={(e) => e.preventDefault()}>
                                    Xərçəng müalicəsi
                                </a>
                            </div>
                            <img src={rightIcon} alt="" />
                        </div>
                    </Dropdown>
                ),

            },
            { key: "2", label: "Ginekologiya" },
            { key: "3", label: "Kardiologiya" },
            { key: "4", label: "Ortopediya" },
            { key: "5", label: "Pediatriya" },
            { key: "6", label: "Stomatologiya" },
        ]}
    />
);

export default function CategoriesMenuAntd() {
    return (
        <Dropdown overlay={mainMenu} trigger={["hover"]}>
            <a
                onClick={(e) => e.preventDefault()}
                style={{
                    color: "#5f5f5f",
                    fontWeight: 500,
                    fontSize: "16px",
                }}
            >
                Kateqoriyalar
            </a>
        </Dropdown>
    );
}
