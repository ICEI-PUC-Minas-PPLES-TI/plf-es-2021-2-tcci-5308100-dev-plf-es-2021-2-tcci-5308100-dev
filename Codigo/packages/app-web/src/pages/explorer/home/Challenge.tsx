import { useContext, useEffect, useState } from 'react';
import PageCard from '@Components/cards/PageCard';
import { GenericFileType } from '@GlobalTypes';
import { Challenge } from '@sec/common';
import { acceptChallenge } from '@Services/challengeAcceptedService';
import { getChallengeAsExplorer } from '@Services/challengeService';
import ViewViewChallenge, { ExplorerRespondeChallenge } from '@Views/ViewViewChallenge';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContext } from '~/context/ToastContext';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';
import SweetAlert from 'react-bootstrap-sweetalert';
import SweetAlertSendSuccessfully from '@Views/ViewViewChallenge/SweetAlertSendSuccessfully';
import SkeletonViewChallenge from '@Views/ViewViewChallenge/SkeletonViewChallenge';

const ExplorerChallenge = () => {
  const { showToastDanger } = useContext(ToastContext);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [challenge, setChallenge] = useState<Challenge | undefined>(undefined);
  const [sweetAlert, setSweetAlert] = useState<JSX.Element | undefined>(undefined);

  useEffect(() => {
    if (id) fetchData(+id);
  }, [id]);

  const fetchData = async (id: number) => {
    try {
      setIsLoading(true);
      const {
        payload: { challenge },
      } = await getChallengeAsExplorer(id);

      setChallenge(challenge);
    } catch (error: unknown) {
      navigate('/explorador');
      defaultErrorHandler(error, showToastDanger);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnSubmit = async (params: ExplorerRespondeChallenge) => {
    try {
      if (id) {
        await acceptChallenge({ challengeId: +id, response: params.text });

        showSendSuccessfully();
      }
    } catch (error: unknown) {
      defaultErrorHandler(error, showToastDanger);
    }
  };

  const showSendSuccessfully = () => {
    setSweetAlert(<SweetAlertSendSuccessfully />);
  };

  return (
    <PageCard simpleVariant hidePaddingTopExtra>
      {isLoading ? (
        <SkeletonViewChallenge />
      ) : (
        <ViewViewChallenge onSubmit={handleOnSubmit} challenge={challenge as Challenge} />
      )}

      {sweetAlert}
    </PageCard>
  );
};

export default ExplorerChallenge;
