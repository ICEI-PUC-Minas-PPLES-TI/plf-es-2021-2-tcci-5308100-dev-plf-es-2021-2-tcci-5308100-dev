import React from 'react';
import { Col, Container, Row, Card, Table, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SpinLoading from '~/components/loading/SpinLoading';
import { nestedPropByIndex } from '~/utils/util';
import { TableWithActionsProps } from './types';

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

  return (
    <Table>
      <colgroup>
        {columns.map(({ width }, i) => (
          <col key={i + 'TableWithActions-colgroup'} width={width ? width : ''} />
        ))}
        {actions && <col width='90px' />}
      </colgroup>
      <thead>
        <tr>
          {columns.map(({ label, alignment }, i) => (
            <th key={i + 'TableWithActions-thead'} className={`${alignments[alignment || 'left']}`}>
              {label}
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
        ) : data.length === 0 ? (
          <tr>
            <td colSpan={actions ? columns.length + 1 : columns.length} style={{ display: 'table-cell' }}>
              <p className='text-color-default'>{emptyTableMessage}</p>
            </td>
          </tr>
        ) : (
          data.map((row, i) => (
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
                          className={`${classNameFttr ? classNameFttr[fieldData] : ''}`}
                        >
                          {formatter ? formatter(f) : f}
                        </span>
                      ))
                    ) : (
                      <span key={`${field}field_key`} className={`${classNameFttr ? classNameFttr[fieldData] : ''}`}>
                        {formatter ? formatter(fieldData) : fieldData}
                      </span>
                    )}
                  </td>
                );
              })}

              {actions && (
                <td className='td-actions text-center'>
                  {actions.map((action, i) => (
                    <OverlayTrigger key={i + action.iconClass} overlay={<Tooltip id={i + action.iconClass}>{action.tooltip}</Tooltip>}>
                      {action.type === 'BUTTON' ? (
                        <Button className='btn-link' onClick={(event: React.MouseEvent) => action.action(row, event)} variant={action.variant}>
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
