import PageCard from '@Components/cards/PageCard';
import SearchInput from '@Components/Inputs/SearchInput';
import { ModalMethods } from '@Components/modals/Modal';
import TableWithActions from '@Components/tables/TableWithActions';
import { Administrator, AdministratorStatus } from '@sec/common';
import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useRef } from 'react';
import ModalFilter, { InitialFilters } from './ModalFilter';
import { matchSorter } from 'match-sorter';
import { getAllAdministrators, GetAllAdministratorsFilters } from '@Services/administratorService';
import { ToastContext } from '~/context/ToastContext';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';
import { administratorStatusBadge, administratorStatusFttr, formatDate } from '@Utils/formatters';

const Administrators: FunctionComponent = () => {
  const { showToastDanger } = useContext(ToastContext);
  const initialFilters: InitialFilters = {
    status: [AdministratorStatus.ACTIVE, AdministratorStatus.INACTIVE],
  };

  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [administratorsFiltered, setAdministratorsFiltered] = useState<Administrator[]>([]);
  const [searchBox, setSearchBox] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const modalFilter = useRef<ModalMethods>(null);

  useEffect(() => {
    fetchData(initialFilters);
  }, []);

  useEffect(() => {
    setAdministratorsFiltered(matchSorter(administrators, searchBox, { keys: ['nickname', 'name', 'email'] }));
  }, [searchBox, administrators]);

  const fetchData = async (filter: GetAllAdministratorsFilters | null = null) => {
    try {
      setIsLoading(true);
      const {
        payload: { administrators },
      } = await getAllAdministrators(filter);

      setAdministrators(administrators);
    } catch (error) {
      defaultErrorHandler(error, showToastDanger);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <PageCard
        title='Gerenciar administradores'
        actions={[
          {
            type: 'ROUTER',
            variant: 'success',
            to: '/administrador/administradores/salvar',
            label: 'Cadastrar administrador',
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
          emptyTableMessage='Nenhum administrador cadastrado.'
          columns={[
            { field: 'id', label: 'ID', alignment: 'center' },
            { field: 'nickname', label: 'Apelido' },
            { field: 'name', label: 'Nome' },
            { field: 'email', label: 'Email' },
            { field: 'createdAt', label: 'Data de cadastro', alignment: 'center', formatter: formatDate },
            { field: 'status', label: 'Status', alignment: 'center', classNameFttr: administratorStatusBadge, formatter: administratorStatusFttr },
          ]}
          actions={[
            {
              type: 'ROUTER',
              iconClass: 'far fa-edit',
              tooltip: 'Editar',
              variant: 'success',
              to: (a) => `/administrador/administradores/salvar/${a.id}`,
            },
          ]}
          data={administratorsFiltered}
        />
      </PageCard>
      <ModalFilter modalRef={modalFilter} defaultValues={initialFilters} onSubmit={fetchData} />
    </>
  );
};

export default Administrators;
