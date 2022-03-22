import { useContext, useEffect, useState } from 'react';
import PageCard from '@Components/cards/PageCard';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContext } from '~/context/ToastContext';
import { getAllChallengesAsExplorer, getChallengeAsExplorer } from '@Services/challengeService';
import { Challenge } from '@sec/common';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';

const ExplorerHome = () => {
  const { showToastSuccess, showToastDanger } = useContext(ToastContext);
  const navigate = useNavigate();

  const [isAwaiting, setIsAwaiting] = useState(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsAwaiting(true);
      const {
        payload: { challenges },
      } = await getAllChallengesAsExplorer(null);

      setChallenges(challenges);
    } catch (error: unknown) {
      defaultErrorHandler(error, showToastDanger);
    } finally {
      setIsAwaiting(false);
    }
  };

  return (
    <PageCard simpleVariant hidePaddingTopExtra>
      teste
    </PageCard>
  );
};

export default ExplorerHome;
