import './index.scss'
import left from '/src/assets/AdminNavLeft.png'
import logo from '/src/assets/Logo.png'
import searchIcon from "/src/assets/mingcute_search-line.png"
import profileSvg from '/src/assets/profileSvg.svg'
import LanguageDiv2 from "../LanguageDiv/index.jsx";

function AdminNavbar() {
    return (
        <div id={'adminNavbar'}>
            <img src={left} className="left" />
            <div className={'adminNavbar'}>
                <div className={"navLogo"}>
                    <img  src={logo} className="logo"/>
                </div>
                <div className={'navMain'}>
                    <div className={'searchDiv'}>
                        <input type={'text'} placeholder={'Search....'}/>
                        <img src={searchIcon} className="searchIcon"/>
                    </div>
                    <div className={'navRight'}>
                        <LanguageDiv2/>
                        <div className={'hrXett'}></div>
                        <div className={'profileDiv'}>
                            <div className={'profilIcon'}>
                                <img src={profileSvg} className="profileIcon"/>
                            </div>
                            <div className={'contentProfil'}>
                                <h5>Admin</h5>
                                <p>Admin</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminNavbar;