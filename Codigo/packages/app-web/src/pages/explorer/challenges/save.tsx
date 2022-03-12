import PageCard from '@Components/cards/PageCard';
import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContext } from '~/context/ToastContext';

const ChallengesSave = () => {
  const { showToastSuccess, showToastDanger } = useContext(ToastContext);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    //   fetchData(+id);
  }, [id]);

  // const fetchData = async (id?: number) => {
  //   try {
  //     setIsAwaiting(true);
  //       const {
  //         payload: { challenge, explorers, recompenses },
  //       } = await getChallenge(id);
  //
  //       fillForm(challenge);
  //   } catch (error: unknown) {
  //     defaultErrorHandler(error, showToastDanger);
  //   } finally {
  //     setIsAwaiting(false);
  //   }
  // };

  return (
    <PageCard simpleVariant hidePaddingTopExtra>
      <form className='pt-3 px-5' onSubmit={console.dir}>
        <div className='row'></div>
      </form>
    </PageCard>
  );
};

export default ChallengesSave;
