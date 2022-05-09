import PageCard from '@Components/cards/PageCard';
import SearchInput from '@Components/Inputs/SearchInput';
import { ModalMethods } from '@Components/modals/Modal';
import TableWithActions from '@Components/tables/TableWithActions';
import { ChallengeAccepted, ChallengeAcceptedStatus } from '@sec/common';
import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useRef } from 'react';
import ModalFilter, { InitialFilters } from './ModalFilter';
import { matchSorter } from 'match-sorter';
import {
  getAllChallengesAccepted,
  getAllChallengesAcceptedAsAdministrator,
  GetAllChallengesAcceptedFilters,
} from '@Services/challengeAcceptedService';
import { ToastContext } from '~/context/ToastContext';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';
import { challengeAcceptedStatusBadge, challengeAcceptedStatusFttr, formatDate } from '@Utils/formatters';

const ChallengesAccepted: FunctionComponent = () => {
  const { showToastDanger } = useContext(ToastContext);

  const initialFilters: InitialFilters = {
    status: [ChallengeAcceptedStatus.UNDER_REVIEW, ChallengeAcceptedStatus.PENDING],
  };

  const [challengesAccepted, setChallengesAccepted] = useState<ChallengeAccepted[]>([]);
  const [challengesAcceptedFiltered, setChallengesAcceptedFiltered] = useState<ChallengeAccepted[]>([]);
  const [searchBox, setSearchBox] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const modalFilter = useRef<ModalMethods>(null);

  useEffect(() => {
    fetchData(initialFilters);
  }, []);

  useEffect(() => {
    if (searchBox !== '') {
      setChallengesAcceptedFiltered(
        matchSorter(challengesAccepted, searchBox, {
          keys: ['challenge.title', 'challenge.recompense.name', 'explorer.name'],
        })
      );
    } else {
      setChallengesAcceptedFiltered([...challengesAccepted]);
    }
  }, [searchBox, challengesAccepted]);

  const fetchData = async (filter: GetAllChallengesAcceptedFilters | null = null) => {
    try {
      setIsLoading(true);
      const {
        payload: { challengesAccepted },
      } = await getAllChallengesAcceptedAsAdministrator(filter);

      setChallengesAccepted(challengesAccepted);
    } catch (error) {
      defaultErrorHandler(error, showToastDanger);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageCard title='Gerenciar desafios aceitos'>
        <div className='card-filter'>
          <SearchInput value={searchBox} onChange={(e) => setSearchBox(e.target.value)} />
          <button className='btn btn-secondary rounded-lg' onClick={() => modalFilter.current?.showModal()}>
            Filtrar
          </button>
        </div>
        <TableWithActions
          isLoading={isLoading}
          emptyTableMessage='Não foi encontrado nenhum desafio aceito pelos exploradores. Tente alterar os filtros.'
          columns={[
            { field: 'id', label: 'ID', alignment: 'center', width: '50px' },
            { field: 'challengeTitle', label: 'Desafio' },
            { field: 'recompenseName', label: 'Recompensa' },
            { field: 'explorerName', label: 'Explorador' },
            { field: 'explorerEmail', label: 'Email' },

            { field: 'responsesCount', label: 'Respostas enviadas', width: '115px', alignment: 'center' },
            // { field: 'commentsCount', label: 'Comentários', width: '95px', alignment: 'center' },

            {
              field: 'status',
              label: 'Status',
              width: '90px',
              alignment: 'center',
              classNameFttr: challengeAcceptedStatusBadge,
              formatter: challengeAcceptedStatusFttr,
            },
          ]}
          actions={[
            {
              type: 'ROUTER',
              iconClass: 'far fa-edit',
              tooltip: 'Editar',
              variant: 'success',
              to: (a) => `/administrador/desafios-aceitos/salvar/${a.id}`,
            },
          ]}
          data={challengesAcceptedFiltered.map((c) => ({
            ...c,
            challengeTitle: c.challenge.title,
            recompenseName: c.challenge.recompense.name,
            explorerName: c.explorer.name,
            explorerEmail: c.explorer.email,
            responsesCount: c.responsesCount,
            // commentsCount: (
            //   <>
            //     <span>
            //       <i className='fas fa-user' /> {c.comments.length}
            //     </span>
            //     <span>
            //       <i className='fas fa-user-tie' /> {c.comments.length}
            //     </span>
            //   </>
            // ),
          }))}
        />
      </PageCard>
      <ModalFilter modalRef={modalFilter} defaultValues={initialFilters} onSubmit={fetchData} />
    </>
  );
};

export default ChallengesAccepted;
