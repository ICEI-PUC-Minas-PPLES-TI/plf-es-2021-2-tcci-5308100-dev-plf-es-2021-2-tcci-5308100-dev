import { FunctionComponent, useContext, useEffect, useState } from 'react';
import {
  AcceptResponseDTO,
  Challenge,
  ChallengeAccepted,
  ChallengeAcceptedStatus,
  DeclineResponseDTO,
} from '@sec/common';
import PageCard from '@Components/cards/PageCard';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';
import { ToastContext } from '~/context/ToastContext';
import { useNavigate, useParams } from 'react-router-dom';
import SkeletonViewChallenge from '@Views/ViewViewChallenge/SkeletonViewChallenge';
import ViewViewChallenge, { ExplorerRespondeChallenge } from '@Views/ViewViewChallenge';
import CommentsView, { CommentInputData } from '@Views/CommentsView';
import PreviousAnswerView from '@Views/PreviousAnswerView';
import SweetAlertSendSuccessfully from '@Views/ViewViewChallenge/SweetAlertSendSuccessfully';
import { createComment } from '@Services/commentService';
import {
  acceptChallengeResponse,
  declineChallengeResponse,
  getChallengeAcceptedAsAdministrator,
} from '@Services/challengeAcceptedService';

const ChallengesAcceptedSave: FunctionComponent = () => {
  const { showToastDanger, showToastSuccess, showToastWarning } = useContext(ToastContext);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [challengeAccepted, setChallengeAccepted] = useState<ChallengeAccepted | undefined>();

  useEffect(() => {
    if (id) fetchData(+id);
  }, [id]);

  const fetchData = async (id: number) => {
    try {
      setIsLoading(true);
      const {
        payload: { challengeAccepted },
      } = await getChallengeAcceptedAsAdministrator(id);

      setChallengeAccepted(challengeAccepted);
    } catch (error: unknown) {
      navigate('/administrador/desafios-aceitos');
      defaultErrorHandler(error, showToastDanger);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnSubmitCommit = async ({ text }: CommentInputData) => {
    try {
      if (id) {
        const {
          payload: { comment },
        } = await createComment({ text, acceptedChallengeId: +id });
        challengeAccepted?.comments.push(comment);
        return true;
      }
      return false;
    } catch (error: unknown) {
      defaultErrorHandler(error, showToastDanger);
      return false;
    }
  };

  const changeChallengeAcceptedStatus = async (challengeAcceptedId: number, action: 'ACCEPT' | 'DECLINE') => {
    const changer = {
      ACCEPT: acceptChallengeResponse,
      DECLINE: declineChallengeResponse,
    };

    try {
      const {
        message,
        payload: { challengeAccepted },
      } = await changer[action]({ challengeAcceptedId });

      setChallengeAccepted(challengeAccepted);
      showToastSuccess({ message });

      if (action === 'DECLINE') {
        showToastWarning({ message: 'Não se esqueça de comentar o motivo da recusa.', timeout: 20 });
      } else {
        navigate('/administrador/desafios-aceitos');
      }
    } catch (error: unknown) {
      defaultErrorHandler(error, showToastDanger);
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
          changeStatus={changeChallengeAcceptedStatus}
          comments={<CommentsView comments={challengeAccepted?.comments ?? []} onSubmit={handleOnSubmitCommit} />}
          previousAnswers={<PreviousAnswerView answers={challengeAccepted?.responses ?? []} />}
          // recompenseInformation={<>Lorem ipsum</>}
        />
      )}
    </PageCard>
  );
};

export default ChallengesAcceptedSave;
