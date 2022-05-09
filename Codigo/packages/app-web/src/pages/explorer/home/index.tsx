import { useContext, useEffect, useState } from 'react';
import PageCard from '@Components/cards/PageCard';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContext } from '~/context/ToastContext';
import { getAllChallengesAsExplorer, getChallengeAsExplorer } from '@Services/challengeService';
import { Challenge, Post } from '@sec/common';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';
import ChallengeCard from '@Components/cards/ChallengeCard';
import { range } from '@Utils/util';
import SideCard from '@Components/cards/SideCard';
import PostsListCard from '@Components/cards/PostsListCard';
import AvailableExplorersListCard from '@Components/cards/AvailableExplorersListCard';
import Skeleton from 'react-loading-skeleton';

const postsExample: Post[] = range(10).map((i) => ({ id: i } as Post));

const ExplorerHome = () => {
  const { showToastSuccess, showToastDanger } = useContext(ToastContext);
  const navigate = useNavigate();

  const [isAwaiting, setIsAwaiting] = useState(false);
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
    <div className='d-flex h-100'>
      <PageCard simpleVariant limitedWidth hidePaddingTopExtra>
        {isAwaiting && (
          <>
            <Skeleton height='30px' count={3} />
            <br />
            <Skeleton height='30px' count={3} />
            <br />
            <Skeleton height='30px' count={3} />
          </>
        )}
        {!isAwaiting && challenges.length === 0 && (
          <div className='alert alert-secondary' role='alert'>
            Lamento, no momento não temos nenhum novo desafio para você. <span className='fw-bold'>¯\_(ツ)_/¯</span>
          </div>
        )}
        {challenges.map((challenge) => (
          <div className='row mb-3' key={`ExplorerHome_List_ChallengeCard_${challenge.id}`}>
            <div className='col-12'>
              <ChallengeCard challenge={challenge} onClick={() => navigate(`/explorador/desafio/${challenge.id}`)} />
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

export default ExplorerHome;
