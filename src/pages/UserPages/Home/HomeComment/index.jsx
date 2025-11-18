import { useTranslation } from 'react-i18next';
import Title from '../../../../components/UserComponents/Title/index.jsx';
import CommentCard from '../../../../components/UserComponents/Home/CommentCard/index.jsx';
import back from '/src/assets/CommentBack.png';
import image1 from "/src/assets/commentCardImage.jpg";
import { useState } from "react";
import {useGetAllCustomerViewQuery} from "../../../../services/userApi.jsx";
import {VIEW_CARD_IMAGES} from "../../../../contants.js";
import video from '/src/assets/wmremove-transformed.mp4'
function HomeComment() {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
const {data:getAllCustomerView} = useGetAllCustomerViewQuery()
    const fakeComments = getAllCustomerView?.data


    // Rastgele konumlandırma için fonksiyon
    const getRandomPosition = (existingPositions) => {
        const maxWidth = window.innerWidth; // Tam ekran genişliği
        const maxHeight = window.innerHeight; // Tam ekran yüksekliği
        const containerHeight = 100; // .comment-card'ın min-height'i
        const titleHeight = 100; // Title bileşeninin yaklaşık yüksekliği (tahmini)
        const margin = 250; // Thumbnail'ların kapsayıcıdan uzaklığı
        const minDistance = 30; // Thumbnail'lar arasında minimum mesafe (px cinsinden)
        const thumbnailSize = 50; // Thumbnail genişliği ve yüksekliği
        const maxAttempts = 150; // Maksimum deneme sayısı

        let attempts = 50;
        let left, top;

        do {
            const side = Math.floor(Math.random() * 2); // 0: sol, 1: sağ (sadece sağ ve sol)
            switch (side) {
                case 0: // Sol
                    left = Math.random() * margin;
                    top = Math.random() * (maxHeight - containerHeight - titleHeight) + titleHeight + (containerHeight / 2);
                    break;
                case 1: // Sağ
                    left = maxWidth - (Math.random() * margin) - thumbnailSize;
                    top = Math.random() * (maxHeight - containerHeight - titleHeight) + titleHeight + (containerHeight / 2);
                    break;
            }

            // Mevcut thumbnail'larla mesafeyi kontrol et
            const tooClose = existingPositions.some(pos => {
                const dx = pos.left - left;
                const dy = pos.top - top;
                return Math.sqrt(dx * dx + dy * dy) < minDistance + thumbnailSize; // 20px + thumbnail boyutu
            });

            attempts++;
            if (!tooClose || attempts >= maxAttempts) break;
        } while (true);

        return { left, top };
    };

    // Tüm thumbnail'lar için konumları hesapla
    const positions = [];
    fakeComments?.forEach(() => {
        const pos = getRandomPosition(positions);
        positions.push(pos);
    });

    return (
        <div
            id="home-comment"
            style={{
                padding: '60px 0 150px',
                marginBottom: '150px',
                position: 'relative',
                minHeight: '60vh',
                overflow: "hidden",
            }}
            aria-label={t('homeComment.backgroundAriaLabel')}
        >
            <video
                src={video}
                autoPlay
                loop
                muted
                playsInline
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: -1,
                }}
            />
            <div className="container">
                <Title
                    title={t('homeComment.title')}
                    desc={t('homeComment.desc')}
                />
                <div className="homeComment">
                    <div className="profile-thumbnails">
                        {fakeComments?.map((comment, index) => {
                            const position = positions[index] || { left: 0, top: 0 };
                            return (
                                <div
                                    key={index}
                                    className="thumbnail"
                                    onClick={() => setCurrentIndex(index)}
                                    style={{
                                        position: 'absolute',
                                        left: `${position.left}px`,
                                        top: `${position.top}px`,
                                    }}
                                >
                                    <img
                                        src={VIEW_CARD_IMAGES+comment.profilImage}
                                        alt={`${comment.name}'s profile`}
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <CommentCard
                        currentIndex={currentIndex}
                        setCurrentIndex={setCurrentIndex}
                        fakeComments={fakeComments}
                    />
                </div>
            </div>
        </div>
    );
}

export default HomeComment;