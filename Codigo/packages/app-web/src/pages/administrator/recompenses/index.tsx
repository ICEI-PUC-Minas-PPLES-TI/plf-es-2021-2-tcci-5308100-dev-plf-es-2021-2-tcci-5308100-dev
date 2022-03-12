import PageCard from '@Components/cards/PageCard';
import SearchInput from '@Components/Inputs/SearchInput';
import { ModalMethods } from '@Components/modals/Modal';
import TableWithActions from '@Components/tables/TableWithActions';
import { Recompense, RecompenseStatus, RecompenseType } from '@sec/common';
import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useRef } from 'react';
import ModalFilter, { InitialFilters } from './ModalFilter';
import { matchSorter } from 'match-sorter';
import { getAllRecompenses, GetAllRecompensesFilters } from '@Services/recompenseService';
import { ToastContext } from '~/context/ToastContext';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';
import {
  recompenseStatusBadge,
  recompenseStatusFttr,
  recompenseTypeFttr,
  recompenseTypeBadge,
  formatDate,
} from '@Utils/formatters';

const Recompenses: FunctionComponent = () => {
  const { showToastDanger } = useContext(ToastContext);
  const initialFilters: InitialFilters = {
    type: [RecompenseType.GENERAL, RecompenseType.DISCOUNT_COUPON],
    status: [RecompenseStatus.ACTIVE],
  };

  const [recompenses, setRecompenses] = useState<Recompense[]>([]);
  const [recompensesFiltered, setRecompensesFiltered] = useState<Recompense[]>([]);
  const [searchBox, setSearchBox] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const modalFilter = useRef<ModalMethods>(null);

  useEffect(() => {
    fetchData(initialFilters);
  }, []);

  useEffect(() => {
    setRecompensesFiltered(matchSorter(recompenses, searchBox, { keys: ['name'] }));
  }, [searchBox, recompenses]);

  const fetchData = async (filter: GetAllRecompensesFilters | null = null) => {
    try {
      setIsLoading(true);
      const {
        payload: { recompenses },
      } = await getAllRecompenses(filter);

      setRecompenses(recompenses);
    } catch (error) {
      defaultErrorHandler(error, showToastDanger);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <PageCard
        title='Gerenciar recompensas'
        actions={[
          {
            type: 'ROUTER',
            variant: 'success',
            to: '/administrador/recompensas/salvar',
            label: 'Cadastrar recompensa',
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
          emptyTableMessage='Nenhum recompensa cadastrada.'
          columns={[
            { field: 'id', label: 'ID', alignment: 'center', width: '50px' },
            { field: 'name', label: 'Recompensa' },
            {
              field: 'createdAt',
              label: 'Data de cadastro',
              alignment: 'center',
              width: '150px',
              formatter: formatDate,
            },
            {
              field: 'type',
              label: 'Tipo',
              width: '140px',
              alignment: 'center',
              classNameFttr: recompenseTypeBadge,
              formatter: recompenseTypeFttr,
            },
            {
              field: 'status',
              label: 'Status',
              width: '90px',
              alignment: 'center',
              classNameFttr: recompenseStatusBadge,
              formatter: recompenseStatusFttr,
            },
          ]}
          actions={[
            {
              type: 'ROUTER',
              iconClass: 'far fa-edit',
              tooltip: 'Editar',
              variant: 'success',
              to: (a) => `/administrador/recompensas/salvar/${a.id}`,
            },
          ]}
          data={recompensesFiltered}
        />
      </PageCard>
      <ModalFilter modalRef={modalFilter} defaultValues={initialFilters} onSubmit={fetchData} />
    </>
  );
};

export default Recompenses;
