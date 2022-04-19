import ChallengeCard from '@Components/cards/ChallengeCard';
import ExplorerProfileCard from '@Components/cards/ExplorerProfileCard';
import PageCard from '@Components/cards/PageCard';
import SideCard from '@Components/cards/SideCard';
import { ModalMethods } from '@Components/modals/Modal';
import { ChallengeAccepted, ChallengeAcceptedStatus, Explorer } from '@sec/common';
import { getAllChallengesAccepted, GetAllChallengesAcceptedFilters } from '@Services/challengeAcceptedService';
import { getExplorerProfile } from '@Services/explorerService';
import { sortAcceptChallengeByStatus } from '@Utils/util';
import arraySort from 'array-sort';
import { useContext, useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '~/context/AuthContext';
import { ToastContext } from '~/context/ToastContext';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';
import ModalEditExplorerProfile from './ModalEditExplorerProfile';

const ExplorerProfile = () => {
  const navigate = useNavigate();
  const modalEditExplorerProfile = useRef<ModalMethods>(null);
  const { showToastDanger } = useContext(ToastContext);
  const { user } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [explorer, setExplorer] = useState<Explorer | undefined>(undefined);
  const [challengesAccepted, setChallengesAccepted] = useState<ChallengeAccepted[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const {
        payload: { explorer },
      } = await getExplorerProfile(user.id);

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
        <ExplorerProfileCard explorer={explorer} onEdit={() => modalEditExplorerProfile.current?.showModal()} />
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
                onClick={() => navigate(`/explorador/desafio-aceito/${challengeAccepted.id}`)}
              />
            </div>
          </div>
        ))}
      </PageCard>
      <SideCard>
        <div className='card rounded-md mb-2 flex-center' style={{ height: '40vh' }}>
          side card
        </div>
        <div className='card rounded-md flex-center' style={{ height: '40vh' }}>
          side card
        </div>
      </SideCard>
      <ModalEditExplorerProfile modalRef={modalEditExplorerProfile} explorer={explorer} onSubmit={setExplorer} />
    </div>
  );
};

export default ExplorerProfile;
