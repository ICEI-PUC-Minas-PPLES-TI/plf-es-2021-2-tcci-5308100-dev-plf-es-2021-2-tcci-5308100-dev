import PageCard from '@Components/cards/PageCard';
import { Challenge, ChallengeAccepted, ChallengeAcceptedStatus, ChallengeStatus, Recompense } from '@sec/common';
import {
  getChallengeAccepted,
  redeemChallengeAcceptedRecompense,
  sendChallengeResponse,
} from '@Services/challengeAcceptedService';
import { createComment } from '@Services/commentService';
import CommentsView, { CommentInputData } from '@Views/CommentsView';
import PreviousAnswerView from '@Views/PreviousAnswerView';
import RecompenseInformationView from '@Views/RecompenseInformationView';
import ViewViewChallenge, { ExplorerRespondeChallenge } from '@Views/ViewViewChallenge';
import SkeletonViewChallenge from '@Views/ViewViewChallenge/SkeletonViewChallenge';
import SweetAlertSendSuccessfully from '@Views/ViewViewChallenge/SweetAlertSendSuccessfully';
import React, { useContext, useEffect, useState } from 'react';
import { Placeholder } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContext } from '~/context/ToastContext';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';

const ExplorerChallengeAccepted = () => {
  const { showToastDanger } = useContext(ToastContext);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [challengeAccepted, setChallengeAccepted] = useState<ChallengeAccepted | undefined>();
  const [recompense, setRecompense] = useState<Recompense | undefined>(undefined);
  const [sweetAlert, setSweetAlert] = useState<JSX.Element | undefined>(undefined);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });

    if (id) fetchData(+id);
  }, [id]);

  const fetchData = async (id: number) => {
    try {
      setIsLoading(true);
      const {
        payload: { challengeAccepted },
      } = await getChallengeAccepted(id);

      setChallengeAccepted(challengeAccepted);
    } catch (error: unknown) {
      navigate('/explorador/perfil');
      defaultErrorHandler(error, showToastDanger);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnSubmit = async (params: ExplorerRespondeChallenge) => {
    try {
      if (id) {
        await sendChallengeResponse(
          { challengeAcceptedId: +id, response: params.text },
          params.files.map(({ file }) => file as File),
          params.images.map(({ file }) => file as File)
        );

        showSendSuccessfully();
      }
    } catch (error: unknown) {
      defaultErrorHandler(error, showToastDanger);
    }
  };

  const showSendSuccessfully = () => {
    setSweetAlert(<SweetAlertSendSuccessfully />);
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

  const redeemRecompense = async (challengeAcceptedId: number) => {
    try {
      const {
        payload: { recompense },
      } = await redeemChallengeAcceptedRecompense(challengeAcceptedId);

      setRecompense(recompense);
      return true;
    } catch (error: unknown) {
      defaultErrorHandler(error, showToastDanger);
      return false;
    }
  };

  return (
    <PageCard simpleVariant hidePaddingTopExtra>
      {isLoading ? (
        <SkeletonViewChallenge />
      ) : (
        <ViewViewChallenge
          onSubmit={handleOnSubmit}
          challenge={challengeAccepted?.challenge as Challenge}
          challengeAccepted={challengeAccepted}
          readOnly={challengeAccepted?.status === ChallengeAcceptedStatus.COMPLETE ?? true}
          comments={<CommentsView comments={challengeAccepted?.comments ?? []} onSubmit={handleOnSubmitCommit} />}
          previousAnswers={<PreviousAnswerView answers={challengeAccepted?.responses ?? []} />}
          recompenseInformation={recompense && <RecompenseInformationView recompense={recompense} />}
          onRedeemRecompense={redeemRecompense}
        />
      )}

      {sweetAlert}
    </PageCard>
  );
};

export default ExplorerChallengeAccepted;
