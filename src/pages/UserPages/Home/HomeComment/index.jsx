import './index.scss';
import Title from "../../../../components/UserComponents/Title/index.jsx";
import back from "/src/assets/CommentBack.png";
import CommentCard from "../../../../components/UserComponents/Home/CommentCard/index.jsx";

// Örnek yorum verileri (gerçek uygulamada bu veri bir API'den gelebilir)
const comments = [
    {
        name: "Aytaç M",
        country: "Azərbaycan",
        text: "Müalicə prosesi çox rahat və stressiz keçdi. Hər şey əvvəlcədən təşkil olunmuşdu – transfer, otel, xəstəxana. Həkimlər və personal çox diqqətli idi! Ən əsası özümü təhlükəsiz hiss etdim.",
    },
    // Daha fazla yorum eklenebilir
];

function HomeComment() {
    return (
        <div
            id={"home-comment"}
            style={{
                backgroundImage: `url(${back})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className={"container"}>
                <Title
                    title={"Bizə Güvənənlər"}
                    desc={"Müalicə və sağlamlıq səyahətində bizi seçən insanların təcrübələri və fikirləri."}
                />
                <div className={"homeComment"}>
                    {comments.map((comment, index) => (
                        <CommentCard
                            key={index}
                            name={comment.name}
                            country={comment.country}
                            text={comment.text}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomeComment;