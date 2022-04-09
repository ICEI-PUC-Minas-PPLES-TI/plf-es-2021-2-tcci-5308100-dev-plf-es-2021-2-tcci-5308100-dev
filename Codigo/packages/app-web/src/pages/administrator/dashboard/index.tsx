import InfoCard from '@Components/cards/InfoCard';
import PageCard from '@Components/cards/PageCard';
import LineChart from '@Components/charts/LineChart';
import { Serie as LineSerie } from '@nivo/line';
import { AccessLast30Days } from '@sec/common';
import { getDashboardData } from '@Services/reportsService';
import { generateRandom } from '@Utils/util';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { ToastContext } from '~/context/ToastContext';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';

const Dashboard = () => {
  const { showToastDanger } = useContext(ToastContext);

  const [isLoading, setIsLoading] = useState(false);

  const [accessToday, setAccessToday] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOpenChallenges, setTotalOpenChallenges] = useState(0);
  const [totalChallenges, setTotalChallenges] = useState(0);
  const [challengeResponseAwaitingReview, setChallengeResponseAwaitingReview] = useState(undefined);
  const [commentsWithoutResponse, setCommentsWithoutResponse] = useState(undefined);
  const [postsWithHashtags, setPostsWithHashtags] = useState(0);
  const [postsWithHashtagsLast24h, setPostsWithHashtagsLast24h] = useState(0);

  const [chartAccessLast30Days, setChartAccessLast30Days] = useState<LineSerie[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const {
        payload: { accessLast30Days, totalUsers, totalOpenChallenges, totalChallenges },
      } = await getDashboardData({});

      setAccessToday(
        accessLast30Days.find(({ dayOfMonth }) => dayOfMonth === moment().format('YYYY-MM-DD'))?.qtdAccess || 0
      );
      setTotalUsers(totalUsers);
      setTotalOpenChallenges(totalOpenChallenges);
      setTotalChallenges(totalChallenges);

      setChartAccessLast30Days([
        {
          id: 'Acessos',
          color: 'hsl(169, 70%, 50%)',
          data: mountChartDays(accessLast30Days),
        },
      ]);
    } catch (error) {
      defaultErrorHandler(error, showToastDanger);
    } finally {
      setIsLoading(false);
    }
  };

  const mountChartDays = (accessLast30Days: AccessLast30Days[]) => {
    const days = [];
    const date = moment().subtract(29, 'days');

    for (let index = 0; index < 30; index++) {
      const access = accessLast30Days.find(
        ({ dayOfMonth }) => dayOfMonth.slice(5).split('-').reverse().join('/') === date.format('DD/MM')
      );

      days.push({ x: date.format('DD/MM'), y: access?.qtdAccess || 0 });
      date.add(1, 'day');
    }

    return days;
  };

  return (
    <>
      <div className='row'>
        <InfoCard
          isLoading={isLoading}
          doubleLine
          icon='fas fa-users'
          iconVariant='info'
          label='Acessos hoje'
          value={`${accessToday} ${accessToday === 1 ? 'acesso' : 'acessos'}`}
        />
        <InfoCard
          isLoading={isLoading}
          doubleLine
          icon='fas fa-users'
          iconVariant='info'
          label='Total de usuários'
          value={`${totalUsers} ${totalUsers === 1 ? 'usuário' : 'usuários'}`}
        />
        <InfoCard
          isLoading={isLoading}
          doubleLine
          icon='fas fa-users'
          iconVariant='success'
          label='Desafios em aberto'
          value={`${totalOpenChallenges} ${totalOpenChallenges === 1 ? 'desafio' : 'desafios'}`}
        />
        <InfoCard
          isLoading={isLoading}
          doubleLine
          icon='fas fa-users'
          iconVariant='primary'
          label='Total de desafios criados'
          value={`${totalChallenges} ${totalChallenges === 1 ? 'desafio' : 'desafios'}`}
        />
        <InfoCard
          isLoading={isLoading}
          doubleLine
          icon='fas fa-users'
          iconVariant='warning'
          label='Avaliações de desafios pendentes'
          value={`${challengeResponseAwaitingReview} ${challengeResponseAwaitingReview === 1 ? 'desafio' : 'desafios'}`}
        />
        <InfoCard
          isLoading={isLoading}
          doubleLine
          icon='fas fa-users'
          iconVariant='warning'
          label='Comentários sem respostas'
          value={`${commentsWithoutResponse} ${commentsWithoutResponse === 1 ? 'comentário' : 'comentários'}`}
        />
        <InfoCard
          isLoading={isLoading}
          doubleLine
          icon='fas fa-users'
          iconVariant='secondary'
          label='Publicações utilizando as hashtags'
          value={`${postsWithHashtags} ${postsWithHashtags === 1 ? 'publicação' : 'publicações'}`}
        />
        <InfoCard
          isLoading={isLoading}
          doubleLine
          icon='fas fa-users'
          iconVariant='secondary'
          label='Publicações com hashtags observadas na ultimas 24h'
          value={`${postsWithHashtagsLast24h} ${postsWithHashtagsLast24h === 1 ? 'publicação' : 'publicações'}`}
        />
      </div>

      <div className='row m-0'>
        <PageCard
          title='Dashboard'
          actions={[
            {
              type: 'BUTTON',
              variant: 'success',
              label: 'Exportar relatórios',
              onClick: () => '',
            },
          ]}
        >
          <div style={{ height: '400px' }}>
            <LineChart dataLines={chartAccessLast30Days} xLabel='Dia do mês' yLabel='Número de acessos' />
          </div>
        </PageCard>
      </div>
    </>
  );
};

export default Dashboard;