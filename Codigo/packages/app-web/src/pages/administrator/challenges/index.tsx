import PageCard from '@Components/cards/PageCard';
import SearchInput from '@Components/Inputs/SearchInput';
import { ModalMethods } from '@Components/modals/Modal';
import TableWithActions from '@Components/tables/TableWithActions';
import { Challenge, ChallengeStatus } from '@sec/common';
import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useRef } from 'react';
import ModalFilter, { InitialFilters } from './ModalFilter';
import { matchSorter } from 'match-sorter';
import { getAllChallenges, GetAllChallengesFilters } from '@Services/challengeService';
import { ToastContext } from '~/context/ToastContext';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';
import { challengeStatusBadge, challengeStatusFttr, formatDate } from '@Utils/formatters';

const Challenges: FunctionComponent = () => {
  const { showToastDanger } = useContext(ToastContext);

  const initialFilters: InitialFilters = {
    status: [ChallengeStatus.OPEN, ChallengeStatus.DRAFT],
  };

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [challengesFiltered, setChallengesFiltered] = useState<Challenge[]>([]);
  const [searchBox, setSearchBox] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const modalFilter = useRef<ModalMethods>(null);

  useEffect(() => {
    fetchData(initialFilters);
  }, []);

  useEffect(() => {
    setChallengesFiltered(matchSorter(challenges, searchBox, { keys: ['title', 'recompenseName'] }));
  }, [searchBox, challenges]);

  const fetchData = async (filter: GetAllChallengesFilters | null = null) => {
    try {
      setIsLoading(true);
      const {
        payload: { challenges },
      } = await getAllChallenges(filter);

      setChallenges(challenges);
    } catch (error) {
      defaultErrorHandler(error, showToastDanger);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageCard
        title='Gerenciar desafios'
        actions={[
          {
            type: 'ROUTER',
            variant: 'success',
            to: '/administrador/desafios/salvar',
            label: 'Cadastrar desafio',
          },
        ]}
      >
        <div className='card-filter'>
          <SearchInput value={searchBox} onChange={(e) => setSearchBox(e.target.value)} />
          <button className='btn btn-secondary rounded-lg' onClick={() => modalFilter.current?.showModal()}>
            Filtrar
          </button>
        </div>
        <TableWithActions
          isLoading={isLoading}
          emptyTableMessage='Nenhum desafio cadastrado.'
          columns={[
            { field: 'id', label: 'ID', alignment: 'center', width: '50px' },
            { field: 'title', label: 'Desafio' },
            { field: 'recompenseName', label: 'Recompensa' },
            { field: 'countAcceptedChallenges', label: 'Participações', alignment: 'center', width: '120px' },
            {
              field: 'status',
              label: 'Status',
              width: '90px',
              alignment: 'center',
              classNameFttr: challengeStatusBadge,
              formatter: challengeStatusFttr,
            },
          ]}
          actions={[
            {
              type: 'ROUTER',
              iconClass: 'far fa-edit',
              tooltip: 'Editar',
              variant: 'success',
              to: (a) => `/administrador/desafios/salvar/${a.id}`,
            },
          ]}
          data={challengesFiltered.map((c) => ({
            ...c,
            countAcceptedChallenges: c.acceptedChallenges.length,
            recompenseName: c.recompense.name,
          }))}
        />
      </PageCard>
      <ModalFilter modalRef={modalFilter} defaultValues={initialFilters} onSubmit={fetchData} />
    </>
  );
};

export default Challenges;
