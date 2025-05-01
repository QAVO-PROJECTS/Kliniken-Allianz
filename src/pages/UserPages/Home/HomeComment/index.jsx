import './index.scss';
import { useTranslation } from 'react-i18next';
import Title from '../../../../components/UserComponents/Title/index.jsx';
import CommentCard from '../../../../components/UserComponents/Home/CommentCard/index.jsx';
import back from '/src/assets/CommentBack.png';

function HomeComment() {
    const { t } = useTranslation();

    const comments = [
        {
            name: t('homeComment.comments.aytacM.name'),
            country: t('homeComment.comments.aytacM.country'),
            text: t('homeComment.comments.aytacM.text'),
        },
    ];

    return (
        <div
            id="home-comment"
            style={{
                backgroundImage: `url(${back})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
            }}
            aria-label={t('homeComment.backgroundAriaLabel')}
        >
            <div className="container">
                <Title
                    title={t('homeComment.title')}
                    desc={t('homeComment.desc')}
                />
                <div className="homeComment">
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