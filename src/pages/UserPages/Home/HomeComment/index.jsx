import { useTranslation } from 'react-i18next';
import Title from '../../../../components/UserComponents/Title/index.jsx';
import CommentCard from '../../../../components/UserComponents/Home/CommentCard/index.jsx';
import back from '/src/assets/CommentBack.png';

function HomeComment() {
    const { t } = useTranslation();

    return (
        <div
            id="home-comment"
            style={{
                backgroundImage: `url(${back})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                padding: '60px 0 150px',
                marginBottom: '150px',
            }}
            aria-label={t('homeComment.backgroundAriaLabel')}
        >
            <div className="container">
                <Title
                    title={t('homeComment.title')}
                    desc={t('homeComment.desc')}
                />
                <div className="homeComment">
                    <CommentCard />
                </div>
            </div>
        </div>
    );
}

export default HomeComment;