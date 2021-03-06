import React, { useEffect, useState } from 'react';
import arraySort from 'array-sort';
import { Col, Container, Row, Card, Table, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SpinLoading from '~/components/loading/SpinLoading';
import { nestedPropByIndex } from '~/utils/util';
import { TableWithActionsProps } from './types';

type sortDirections = 'UP' | 'DOWN' | 'NONE';

const sortIcons: { [key in sortDirections]: JSX.Element } = {
  NONE: <i className='fas fa-sort' />,
  UP: <i className='fas fa-sort-up' />,
  DOWN: <i className='fas fa-sort-down' />,
};

const TableWithActions: <T extends { id?: number }>(props: TableWithActionsProps<T>) => JSX.Element = ({
  columns,
  data,
  actions,
  isLoading,
  emptyTableMessage,
}) => {
  const alignments = {
    right: 'text-right',
    center: 'text-center',
    left: 'text-left',
  };

  const [dataSorted, setDataSorted] = useState<typeof data>([...data]);
  const [sortState, setSortState] = useState<{
    field: typeof columns[number]['field'];
    direction: sortDirections;
  }>({
    field: 'id',
    direction: 'NONE',
  });

  useEffect(() => {
    if (sortState.direction !== 'NONE' && typeof sortState.field === 'string') {
      setDataSorted([...arraySort([...data], sortState.field, { reverse: sortState.direction === 'DOWN' })]);
    } else {
      setDataSorted([...data]);
    }
  }, [data, sortState]);

  const calcColumnWidth = (width: typeof columns[number]['width'], sortable: typeof columns[number]['sortable']) => {
    const sortIconWidth = '11px';
    if (width && sortable) {
      return `calc(${width} + ${sortIconWidth})`;
    } else if (width && !sortable) {
      return width;
    } else if (!width && sortable) {
      return sortIconWidth;
    } else {
      return '';
    }
  };

  const nextSortState = (field: typeof columns[number]['field']) => {
    setSortState(({ direction }) => {
      if (direction === 'NONE') {
        return { field, direction: 'UP' };
      } else if (direction === 'UP') {
        return { field, direction: 'DOWN' };
      } else if (direction === 'DOWN') {
        return { field, direction: 'NONE' };
      } else {
        return { field: 'id', direction: 'NONE' };
      }
    });
  };

  return (
    <Table>
      <colgroup>
        {columns.map(({ width, sortable }, i) => (
          <col key={i + 'TableWithActions-colgroup'} width={calcColumnWidth(width, sortable)} />
        ))}
        {actions && <col width='90px' />}
      </colgroup>
      <thead>
        <tr>
          {columns.map(({ label, alignment, field, sortable }, i) => (
            <th
              key={i + 'TableWithActions-thead'}
              className={`${alignments[alignment || 'left']} ${sortable ? 'clickable' : ''}`}
              onClick={sortable ? () => nextSortState(field) : undefined}
            >
              {label}
              {sortable && (
                <div className='d-inline' style={{ marginLeft: '2px' }}>
                  {sortState.field === field && sortIcons[sortState.direction]}
                </div>
              )}
            </th>
          ))}
          {actions && <th></th>}
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={actions ? columns.length + 1 : columns.length} style={{ display: 'table-cell' }}>
              <SpinLoading />
            </td>
          </tr>
        ) : dataSorted.length === 0 ? (
          <tr>
            <td colSpan={actions ? columns.length + 1 : columns.length} style={{ display: 'table-cell' }}>
              <p className='text-color-default'>{emptyTableMessage}</p>
            </td>
          </tr>
        ) : (
          dataSorted.map((row, i) => (
            <tr key={row.id ? row.id + 'TableWithActions-tbody-row' : i + 'TableWithActions-tbody-row'}>
              {columns.map(({ field, alignment, formatter, className, classNameFttr }, j) => {
                const fieldData = row[field];
                return (
                  <td
                    className={`${alignments[alignment || 'left'] || ''} ${className || ''}`}
                    key={
                      row.id
                        ? row.id.toString() + j.toString() + 'TableWithActions-tbody-row-col'
                        : i.toString() + j.toString() + 'TableWithActions-tbody-row-col'
                    }
                  >
                    {Array.isArray(fieldData) ? (
                      fieldData.map((f, i) => (
                        <span
                          key={`${field}${i}field_key`}
                          style={{ display: 'block' }}
                          className={`${classNameFttr ? classNameFttr(f) : ''}`}
                        >
                          {formatter ? formatter(f) : f}
                        </span>
                      ))
                    ) : (
                      <span key={`${field}field_key`} className={`${classNameFttr ? classNameFttr(fieldData) : ''}`}>
                        {formatter ? formatter(fieldData) : fieldData}
                      </span>
                    )}
                  </td>
                );
              })}

              {actions && (
                <td className='td-actions text-center'>
                  {actions.map((action, i) => (
                    <OverlayTrigger
                      key={i + action.iconClass}
                      overlay={<Tooltip id={i + action.iconClass}>{action.tooltip}</Tooltip>}
                    >
                      {action.type === 'BUTTON' ? (
                        <Button
                          className={`btn-link text-${action.variant}`}
                          onClick={(event: React.MouseEvent) => action.action(row, event)}
                          variant={'link'}
                        >
                          <i className={action.iconClass} />
                        </Button>
                      ) : action.type === 'ROUTER' ? (
                        <Link className={`btn-link text-${action.variant}`} to={action.to(row)}>
                          <i className={action.iconClass} />
                        </Link>
                      ) : (
                        <></>
                      )}
                    </OverlayTrigger>
                  ))}
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};

export default TableWithActions;
