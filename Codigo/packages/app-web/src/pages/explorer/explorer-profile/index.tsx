import { ChallengeAcceptedCard } from '@Components/cards/ChallengeAcceptedCard';
import { ExplorerProfileCard } from '@Components/cards/ExplorerProfileCard';
import PageCard from '@Components/cards/PageCard';
import { SideCard } from '@Components/cards/SideCard';
import { ChallengeAccepted, ChallengeAcceptedStatus } from '@sec/common';
import { getAllChallengesAccepted, GetAllChallengesAcceptedFilters } from '@Services/challengeAcceptedService';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContext } from '~/context/ToastContext';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';

const ExplorerProfile = () => {
  const navigate = useNavigate();
  const { showToastDanger } = useContext(ToastContext);

  const initialFilters: GetAllChallengesAcceptedFilters = {
    status: [ChallengeAcceptedStatus.UNDER_REVIEW, ChallengeAcceptedStatus.PENDING, ChallengeAcceptedStatus.COMPLETE],
  };

  const [isLoading, setIsLoading] = useState(false);
  const [challengesAccepted, setChallengesAccepted] = useState<ChallengeAccepted[]>([]);

  useEffect(() => {
    fetchData(initialFilters);
  }, []);

  const fetchData = async (filter: GetAllChallengesAcceptedFilters | null = null) => {
    try {
      setIsLoading(true);
      const {
        payload: { challengesAccepted },
      } = await getAllChallengesAccepted(filter);

      setChallengesAccepted(challengesAccepted);
    } catch (error) {
      defaultErrorHandler(error, showToastDanger);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='d-flex'>
      <PageCard simpleVariant limitedWidth hidePaddingTopExtra>
        <ExplorerProfileCard
          explorer={
            {
              nickname: 'bianca_julia',
              name: 'Bianca Julia Regina Beatriz Gomes',
              createdAt: '2022-03-16 23:27:36.628',
              countChallengeCompleted: 11,
              favoriteProduct: 'Cerveja',
              biography: 'Estudante de programação \\o/',
              instagram: 'bianca_julia',
              tikTok: 'bianca_julia',
              twitter: '@bianca_julia',
              facebook: '@bianca_julia',
              linkedIn: '@bianca_julia',
            } as any
          }
        />
        {challengesAccepted.map((challengeAccepted, i) => (
          <div className='row' key={'ChallengeAcceptedCard' + i}>
            <div className='col-12'>
              <ChallengeAcceptedCard
                challengeAccepted={challengeAccepted}
                onClick={() => navigate(`/explorador/desafio-aceito/${challengeAccepted.id}`)}
              />
            </div>
          </div>
        ))}
      </PageCard>
      <SideCard>
        <div className='card rounded-md mb-2' style={{ height: '40vh' }}>
          side card
        </div>
        <div className='card rounded-md ' style={{ height: '40vh' }}>
          side card
        </div>
      </SideCard>
    </div>
  );
};

export default ExplorerProfile;
