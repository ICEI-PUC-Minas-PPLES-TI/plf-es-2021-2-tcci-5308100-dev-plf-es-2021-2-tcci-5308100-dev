import PageCard from '@Components/cards/PageCard';
import { Challenge, ChallengeAccepted, Recompense } from '@sec/common';
import {
  getReadOnlyChallengeAccepted,
  redeemChallengeAcceptedRecompense,
  sendChallengeResponse,
} from '@Services/challengeAcceptedService';
import { createComment } from '@Services/commentService';
import { CommentInputData } from '@Views/CommentsView';
import ViewViewChallenge, { ExplorerRespondeChallenge } from '@Views/ViewViewChallenge';
import SkeletonViewChallenge from '@Views/ViewViewChallenge/SkeletonViewChallenge';
import SweetAlertSendSuccessfully from '@Views/ViewViewChallenge/SweetAlertSendSuccessfully';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContext } from '~/context/ToastContext';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';

const ExplorerChallengeAccepted = () => {
  const { showToastDanger } = useContext(ToastContext);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [challengeAccepted, setChallengeAccepted] = useState<ChallengeAccepted | undefined>();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });

    if (id) fetchData(+id);
  }, [id]);

  const fetchData = async (id: number) => {
    try {
      setIsLoading(true);
      const {
        payload: { challengeAccepted },
      } = await getReadOnlyChallengeAccepted(id);

      setChallengeAccepted(challengeAccepted);
    } catch (error: unknown) {
      navigate('/explorador/perfil');
      defaultErrorHandler(error, showToastDanger);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageCard simpleVariant hidePaddingTopExtra>
      {isLoading ? (
        <SkeletonViewChallenge />
      ) : (
        <ViewViewChallenge
          challenge={challengeAccepted?.challenge as Challenge}
          challengeAccepted={challengeAccepted}
          readOnly={true}
        />
      )}
    </PageCard>
  );
};

export default ExplorerChallengeAccepted;
