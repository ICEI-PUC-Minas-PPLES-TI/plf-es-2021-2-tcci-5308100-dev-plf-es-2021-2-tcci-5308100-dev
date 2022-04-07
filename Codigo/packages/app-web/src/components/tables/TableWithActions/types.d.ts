import { Variant } from '@GlobalTypes';

type indexable<T> = { [K in keyof T]: T[K] };

interface TableWithActionsProps<T extends indexable<T>> {
  isLoading?: boolean;
  emptyTableMessage: string;
  columns: TableColumn<T>[];
  data: T[];
  actions?: (TableActionButton<T> | TableActionRouter<T>)[];
}
interface TableColumn<T> {
  label: string | JSX.Element;
  width?: string;
  alignment?: 'right' | 'center' | 'left';
  field: keyof T;
  formatter?: (field: any) => string;
  className?: string;
  classNameFttr?: (field: any) => string;
  sortable?: boolean;
}

interface TableAction<T> {
  type: 'BUTTON' | 'LINK' | 'ROUTER';
  iconClass: string;
  tooltip: string;
  variant?: Variant;
}

interface TableActionButton<T> extends TableAction<T> {
  type: 'BUTTON';
  action: (item: T, event: React.MouseEvent) => void;
}

interface TableActionRouter<T> extends TableAction<T> {
  type: 'ROUTER';
  to: (item: T) => string;
}
