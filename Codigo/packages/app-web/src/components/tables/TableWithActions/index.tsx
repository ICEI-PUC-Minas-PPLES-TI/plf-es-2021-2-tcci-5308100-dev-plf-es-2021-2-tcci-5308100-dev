import React from 'react';
import { Col, Container, Row, Card, Table, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import SpinLoading from '~/components/loading/SpinLoading';
import { nestedPropByIndex } from '~/utils/util';

const TableWithActions: <T extends { id?: number }>(props: TableWithActionsProps<T>) => JSX.Element = ({
  columns,
  data,
  actions,
  isLoading,
  emptyTableMessage,
}) => {
  return (
    <Table>
      <colgroup>
        {columns.map(({ width }, i) => (
          <col key={i + 'TableWithActions-colgroup'} width={width ? width : ''} />
        ))}
        {actions && <col width="90px" />}
      </colgroup>
      <thead>
        <tr>
          {columns.map(({ label, alignment }, i) => (
            <th key={i + 'TableWithActions-thead'} className={alignment}>
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
              <p className="text-color-default">{emptyTableMessage}</p>
            </td>
          </tr>
        ) : (
          data.map((row, i) => (
            <tr key={row.id ? row.id + 'TableWithActions-tbody-row' : i + 'TableWithActions-tbody-row'}>
              {columns.map(({ field, alignment }, j) => (
                <td
                  className={alignment}
                  key={
                    row.id
                      ? row.id.toString() + j.toString() + 'TableWithActions-tbody-row-col'
                      : i.toString() + j.toString() + 'TableWithActions-tbody-row-col'
                  }
                >
                  {Array.isArray(nestedPropByIndex(row, field)) ? (
                    nestedPropByIndex(row, field).map((f: any, i: number) =>
                      i === 0 ? (
                        <span key={field + i + 'field_key'} style={{ display: 'block' }}>
                          {f}
                        </span>
                      ) : (
                        // <>
                        //   <br />
                        <span key={field + i + 'field_key'} style={{ display: 'block' }}>
                          {f}
                        </span>
                        // </>
                      )
                    )
                  ) : (
                    <span key={field + 'field_key'}>{nestedPropByIndex(row, field)}</span>
                  )}
                </td>
              ))}

              {actions && (
                <td className="td-actions text-center">
                  {actions.map(({ iconClass, tooltip, variant, action }, i) => (
                    <OverlayTrigger key={i + iconClass} overlay={<Tooltip id={i + iconClass}>{tooltip}</Tooltip>}>
                      <Button className="btn-link btn-xs" onClick={(event: React.MouseEvent) => action(row, event)} variant={variant}>
                        <i className={iconClass} />
                      </Button>
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
