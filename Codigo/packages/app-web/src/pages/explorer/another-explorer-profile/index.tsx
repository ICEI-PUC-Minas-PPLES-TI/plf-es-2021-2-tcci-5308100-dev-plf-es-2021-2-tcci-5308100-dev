import AvailableExplorersListCard from '@Components/cards/AvailableExplorersListCard';
import ChallengeCard from '@Components/cards/ChallengeCard';
import ExplorerProfileCard from '@Components/cards/ExplorerProfileCard';
import PageCard from '@Components/cards/PageCard';
import PostsListCard from '@Components/cards/PostsListCard';
import SideCard from '@Components/cards/SideCard';
import { ChallengeAccepted, Explorer } from '@sec/common';
import { getExplorerProfile } from '@Services/explorerService';
import { sortAcceptChallengeByStatus } from '@Utils/util';
import arraySort from 'array-sort';
import { useContext, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '~/context/AuthContext';
import { ToastContext } from '~/context/ToastContext';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';

const AnotherExplorerProfile = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { showToastDanger } = useContext(ToastContext);
  const routerParams = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(false);
  const [explorer, setExplorer] = useState<Explorer | undefined>(undefined);
  const [challengesAccepted, setChallengesAccepted] = useState<ChallengeAccepted[]>([]);

  useEffect(() => {
    fetchData();
  }, [routerParams.id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setExplorer(undefined);
      const {
        payload: { explorer },
      } = await getExplorerProfile(Number(routerParams.id));

      setExplorer(explorer);
      setChallengesAccepted(
        arraySort(explorer.acceptedChallenges, [sortAcceptChallengeByStatus(), 'updatedAt'], { reverse: true })
      );
    } catch (error) {
      defaultErrorHandler(error, showToastDanger);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='d-flex h-100'>
      <PageCard simpleVariant limitedWidth hidePaddingTopExtra>
        <ExplorerProfileCard noOptions explorer={explorer} />
        {isLoading && (
          <>
            <Skeleton height='30px' count={3} />
            <div className='mb-2' />
            <Skeleton height='30px' count={3} />
          </>
        )}
        {challengesAccepted.map((challengeAccepted, i) => (
          <div className='row mb-3' key={'ChallengeAcceptedCard' + i}>
            <div className='col-12'>
              <ChallengeCard
                challengeAccepted={challengeAccepted}
                challenge={challengeAccepted.challenge}
                onClick={() => navigate(`/explorador/ver-desafio-aceito/${challengeAccepted.id}`)}
              />
            </div>
          </div>
        ))}
      </PageCard>
      <SideCard>
        <AvailableExplorersListCard />
        <div className='w-100 my-3' />
        <PostsListCard />
      </SideCard>
    </div>
  );
};

export default AnotherExplorerProfile;
