import './index.scss'
import earthIconn from "/src/assets/earthIcon.svg"

function LanguageDiv() {
    return (
        <div className={"languageDiv"}>
            <img src={earthIconn} className="profileSvg"/>
        </div>
    );
}

export default LanguageDiv;