import "./index.scss"
import banner from "/src/assets/AboutBanner.png"
import image1 from "/src/assets/AboutFirst.png"
import {Link, useNavigate} from "react-router-dom";
import {t} from "i18next";
import {FaArrowRightLong} from "react-icons/fa6";
import Title from "../../../components/UserComponents/Title/index.jsx";
import {IoCallOutline} from "react-icons/io5";
import {LiaHandshakeSolid} from "react-icons/lia";
import {AiOutlineSafety} from "react-icons/ai";
import {LuNotebookPen} from "react-icons/lu";
function AboutUs() {
    const navigate = useNavigate();
    return (
        <div id={"aboutUs"}>
            <div className={"container"}>
                <div className={"aboutUs"}>
                    <div className={"head"}>
                            <h1>Haqqımızda</h1>
                        <p data-aos="fade-up" data-aos-delay="100">
                            <Link to={"/"}>Ana səhifə</Link>
                            <div className={"dot"}></div>
                            <Link to={"/about"}>Haqqımızda</Link>
                        </p>
                    </div>
                    <div className={"row firstRow"}>
                        <div className={"col-7 col-md-12 col-sm-12 col-xs-12"}>
                            <div className={"content"}>
                                <h2>Hər Addımda Sizinlə: Yüksək Keyfiyyətli Tibbi Xidmətlər</h2>
                                <p>Aviasiya biletlərindən viza dəstəyinə qədər hər detala diqqət yetirərək, sağlamlıq yolculuğunuzu asan və təhlükəsiz bir şəkildə reallaşdırırıq. Bizimlə olan hər addımınızda sizi etibarlı və peşəkar bir xidmət gözləyir.</p>
                                <div className={"more"} onClick={()=>navigate("/contact")}>Bizimlə əlaqəyə keç <button><FaArrowRightLong /></button></div>
                            </div>
                        </div>
                        <div className={"col-5 col-md-12 col-sm-12 col-xs-12"}>
                            <div className={"image"}>
                                <img src={image1} alt=""/>
                            </div>
                        </div>
                    </div>
                    <div className={"main"}>
                        <Title title={"Niyə Kliniken Allianz?"} desc={"Kliniken Allianz olaraq, sağlamlıq turizmi sahəsində fərqli ölkələrdəki ən yaxşı tibbi müəssisələrlə əməkdaşlıq edirik."}/>
                        <div className={"row"}>
                            <div className={"col-3 col-md-6 col-sm-12 col-xs-12"}>
                                <div className={"aboutCard"}>
                                    <div className={"icon"}>
                                        <IoCallOutline />
                                    </div>
                                    <h4>Peşəkar Tibbi Konsultasiya</h4>
                                    <p>Müxtəlif ölkələrdə tanınmış klinikalar və yüksək ixtisaslı həkimlərlə birbaşa əlaqə imkanı.</p>
                                </div>
                            </div>
                            <div className={"col-3 col-md-6 col-sm-12 col-xs-12"}>
                                <div className={"aboutCard"}>
                                    <div className={"icon"}>
                                        <LiaHandshakeSolid />
                                    </div>
                                    <h4>Beynəlxalq Klinikalarla Əməkdaşlıq</h4>
                                    <p> Ölkələrin aparıcı tibb mərkəzləri ilə rəsmi tərəfdaşlıq.</p>
                                </div>
                            </div>
                            <div className={"col-3 col-md-6 col-sm-12 col-xs-12"}>
                                <div className={"aboutCard"}>
                                    <div className={"icon"}>
                                        <AiOutlineSafety />
                                    </div>
                                    <h4>Rahat və Təhlükəsiz Səyahət</h4>
                                    <p>Aviabilet, transfer, otel, tərcüməçi və digər bütün ehtiyacların tam təşkili.</p>
                                </div>
                            </div>
                            <div className={"col-3 col-md-6 col-sm-12 col-xs-12"}>
                                <div className={"aboutCard"}>
                                    <div className={"icon"}>
                                        <LuNotebookPen />
                                    </div>
                                    <h4>Şəffaf Qiymət və Rəsmi Sənədləşmə</h4>
                                    <p>Bütün xidmətlər rəsmi şəkildə, gizli xərclər olmadan təklif olunur.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"bannerAbout"} >
                <img src={banner} alt="banner logo" />
            </div>
        </div>
    );
}

export default AboutUs;