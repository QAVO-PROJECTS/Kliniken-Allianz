import { useTranslation } from 'react-i18next';
import Title from '../../../../components/UserComponents/Title/index.jsx';
import CommentCard from '../../../../components/UserComponents/Home/CommentCard/index.jsx';
import back from '/src/assets/CommentBack.png';
import image1 from "/src/assets/commentCardImage.jpg";
import { useState } from "react";

function HomeComment() {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);

    const fakeComments = [
        { name: "John Doe", country: "USA", image: image1 },
        { name: "Jane Smith", country: "Canada", image: image1 },
        { name: "Ali Yılmaz", country: "Turkey", image: image1 },
        { name: "Emma Brown", country: "UK", image: image1 },
        { name: "Carlos Rivera", country: "Spain", image: image1 },
        { name: "Maria Petrova", country: "Russia", image: image1 },
    ];

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
    fakeComments.forEach(() => {
        const pos = getRandomPosition(positions);
        positions.push(pos);
    });

    return (
        <div
            id="home-comment"
            style={{
                backgroundImage: `url(${back})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                padding: '60px 0 150px',
                marginBottom: '150px',
                position: 'relative',
                minHeight: '100vh',
            }}
            aria-label={t('homeComment.backgroundAriaLabel')}
        >
            <div className="container">
                <Title
                    title={t('homeComment.title')}
                    desc={t('homeComment.desc')}
                />
                <div className="homeComment">
                    <div className="profile-thumbnails">
                        {fakeComments.map((comment, index) => {
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
                                        src={comment.image}
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