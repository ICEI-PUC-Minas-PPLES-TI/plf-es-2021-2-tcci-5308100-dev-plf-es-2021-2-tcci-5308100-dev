import { Explorer } from '@sec/common';
import { searchExplorers } from '@Services/explorerService';
import { matchSorter } from 'match-sorter';
import { Fragment, FunctionComponent, useState } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { useNavigate } from 'react-router-dom';

type SearchInputProps = {
  onSmall?: boolean;
};

const HeaderSearchInput: FunctionComponent<SearchInputProps> = ({ onSmall }) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<Explorer[]>([]);

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      const {
        payload: { explorers },
      } = await searchExplorers(query);

      setOptions(
        matchSorter(
          explorers.map((explorer) => ({ ...explorer, label: `${explorer.name} - ${explorer.email}` })),
          query,
          { keys: ['nickname', 'name', 'email'] }
        )
      );
    } catch (error) {
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBy = () => true;

  return (
    <AsyncTypeahead
      id='search-bar'
      className={`form-control bg-grey border-0 py-2 ps-5 pe-3 rounded-lg no-border-focus ${
        onSmall ? 'search-input-height-on-small' : ''
      }`}
      inputProps={{
        className: 'form-control bg-grey border-0 rounded-lg no-border-focus no-shadow',
        style: onSmall ? { height: '60px' } : undefined,
      }}
      //
      labelKey='email'
      minLength={3}
      isLoading={isLoading}
      //
      filterBy={filterBy}
      options={options}
      onSearch={handleSearch}
      onBlur={() => setOptions([])}
      onChange={([explorer]: any[]) => explorer?.id && navigate(`/explorador/perfil/${explorer.id}`)}
      // onChange={console.dir}
      placeholder='Pesquisar'
      aria-label='Pesquisar'
      renderMenuItemChildren={(explorer: any) => (
        <div className='d-flex flex-row align-items-center' style={{ height: '45px' }}>
          {explorer.avatar ? (
            <img className='rounded-circle avatar-size-sm me-2' src={explorer.avatar.urlPath} />
          ) : (
            <div className='rounded-circle overflow-hidden flex-center align-items-start text-muted me-2 avatar-size-sm'>
              <i className='fas fa-user' />
            </div>
          )}
          <div className='d-flex flex-column' style={{ lineHeight: 1 }}>
            <span style={{ fontSize: '0.9rem' }}>{explorer.name}</span>
            <span style={{ fontSize: '0.8rem' }}>{explorer.email}</span>
          </div>
        </div>
      )}
    />
  );
};

export default HeaderSearchInput;
