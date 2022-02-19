import PageCard from '@Components/cards/PageCard';
import SearchInput from '@Components/Inputs/SearchInput';
import { ModalMethods } from '@Components/modals/Modal';
import TableWithActions from '@Components/tables/TableWithActions';
import { Explorer, ExplorerStatus } from '@sec/common';
import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useRef } from 'react';
import ModalFilter, { InitialFilters } from './ModalFilter';
import { matchSorter } from 'match-sorter';
import { activeExplorers, banExplorers, getAllExplorers, GetAllExplorersFilters } from '@Services/explorerService';
import { ToastContext } from '~/context/ToastContext';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';
import { explorerStatusBadge, explorerStatusFttr, formatDate } from '@Utils/formatters';
import ModalSave, { FormInput } from './ModalSave';
import SweetAlert from 'react-bootstrap-sweetalert';

const Explorers: FunctionComponent = () => {
  const { showToastDanger, showToastSuccess } = useContext(ToastContext);
  const initialFilters: InitialFilters = {
    status: [ExplorerStatus.ACTIVE, ExplorerStatus.UNDER_REVIEW],
  };

  const [explorers, setExplorers] = useState<Explorer[]>([]);
  const [explorersFiltered, setExplorersFiltered] = useState<Explorer[]>([]);
  const [explorersSelected, setExplorersSelected] = useState<number[]>([]);
  const [explorerSelected, setExplorerSelected] = useState<Explorer | null>(null);
  const [searchBox, setSearchBox] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sweetAlert, setSweetAlert] = useState<JSX.Element | null>(null);

  const modalFilter = useRef<ModalMethods>(null);
  const modalSave = useRef<ModalMethods>(null);

  useEffect(() => {
    fetchData(initialFilters);
  }, []);

  useEffect(() => {
    setExplorersFiltered(matchSorter(explorers, searchBox, { keys: ['nickname', 'name', 'email'] }));
  }, [searchBox, explorers]);

  const fetchData = async (filter: GetAllExplorersFilters | null = null) => {
    try {
      setIsLoading(true);
      const {
        payload: { explorers },
      } = await getAllExplorers(filter);

      setExplorers(explorers);
    } catch (error: any) {
      defaultErrorHandler(error, showToastDanger);
    } finally {
      setIsLoading(false);
    }
  };

  const toogleSelection = (checked: boolean, value: number) => {
    if (checked) setExplorersSelected((prev) => [...prev, value]);
    else setExplorersSelected((prev) => prev.filter((p) => p !== value));
  };

  const handleSaveExplorer = async (explorers: Explorer[]) => {
    setExplorerSelected(null);
    setExplorers(explorers);
    modalSave.current?.closeModal();
  };

  const confirmActiveExplorers = () =>
    setSweetAlert(
      <SweetAlert
        warning
        showCloseButton
        showCancel
        cancelBtnBsStyle='btn btn-primary'
        confirmBtnBsStyle='btn btn-secondary'
        title='Atenção'
        onConfirm={handleActiveExplorers}
        onCancel={() => setSweetAlert(null)}
      >
        Tem certeza que deseja <b style={{ fontWeight: 600 }}>ativar</b>{' '}
        {`${explorersSelected.length} ${explorersSelected.length === 1 ? 'explorador' : 'exploradores'}`}?
      </SweetAlert>
    );

  const confirmBanExplorers = () =>
    setSweetAlert(
      <SweetAlert
        warning
        showCloseButton
        showCancel
        cancelBtnBsStyle='btn btn-primary'
        confirmBtnBsStyle='btn btn-secondary'
        title='Atenção'
        onConfirm={handleBanExplorers}
        onCancel={() => setSweetAlert(null)}
      >
        Tem certeza que deseja <b style={{ fontWeight: 600 }}>banir</b>{' '}
        {`${explorersSelected.length} ${explorersSelected.length === 1 ? 'explorador' : 'exploradores'}`}?
      </SweetAlert>
    );

  const handleActiveExplorers = async () => {
    try {
      setIsLoading(true);
      const { message, payload } = await activeExplorers({ explorerIds: explorersSelected });
      setSweetAlert(null);
      setExplorersSelected([]);
      setExplorers(payload.explorers);
      showToastSuccess({ message });
    } catch (error) {
      defaultErrorHandler(error, showToastDanger);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBanExplorers = async () => {
    try {
      setIsLoading(true);
      const { message, payload } = await banExplorers({ explorerIds: explorersSelected });
      setSweetAlert(null);
      setExplorersSelected([]);
      setExplorers(payload.explorers);
      showToastSuccess({ message });
    } catch (error) {
      defaultErrorHandler(error, showToastDanger);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageCard
        title='Gerenciar exploradores'
        actions={[
          {
            type: 'BUTTON',
            variant: 'success',
            label: 'Ativar exploradores',
            onClick: confirmActiveExplorers,
            isDisabled: explorersSelected.length === 0,
          },
          {
            type: 'BUTTON',
            variant: 'danger',
            label: 'Banir exploradores',
            onClick: confirmBanExplorers,
            isDisabled: explorersSelected.length === 0,
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
          emptyTableMessage='Nenhum explorador cadastrado.'
          columns={[
            { field: 'select', label: '#', alignment: 'center' },
            { field: 'id', label: 'ID', alignment: 'center' },
            { field: 'nickname', label: 'Apelido' },
            { field: 'name', label: 'Nome' },
            { field: 'email', label: 'Email' },
            { field: 'createdAt', label: 'Data de cadastro', alignment: 'center', formatter: formatDate },
            { field: 'countChallengeCompleted', label: 'Desafios conquistados', alignment: 'center' },
            { field: 'status', label: 'Status', alignment: 'center', classNameFttr: explorerStatusBadge, formatter: explorerStatusFttr },
          ]}
          actions={[
            {
              type: 'BUTTON',
              iconClass: 'far fa-edit',
              tooltip: 'Editar',
              variant: 'success',
              action: (explorer) => {
                setExplorerSelected(explorer);
                modalSave.current?.showModal();
              },
            },
          ]}
          data={explorersFiltered.map((explorer) => ({
            ...explorer,
            select: (
              <input
                type='checkbox'
                defaultValue={explorer.id}
                checked={!!explorersSelected.find((explorerId) => explorerId == explorer.id)}
                onChange={(event) => toogleSelection(event.target.checked, +event.target.defaultValue)}
              />
            ),
          }))}
        />
      </PageCard>
      <ModalFilter modalRef={modalFilter} defaultValues={initialFilters} onSubmit={fetchData} />
      <ModalSave modalRef={modalSave} explorer={explorerSelected} onSubmit={handleSaveExplorer} />
      {sweetAlert}
    </>
  );
};

export default Explorers;
