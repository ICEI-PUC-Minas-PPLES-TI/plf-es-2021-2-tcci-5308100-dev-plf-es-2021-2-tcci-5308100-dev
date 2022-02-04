type indexable<T> = { [K in keyof T]: T[K] };

interface TableWithActionsProps<T extends indexable<T>> {
  isLoading?: boolean;
  emptyTableMessage: string;
  columns: TableColumn<T>[];
  data: T[];
  actions?: TableAction<T>[];
}
interface TableColumn<T> {
  label: string;
  width?: string;
  alignment?: 'text-right' | 'text-center' | 'text-left';
  field: string;
}

interface TableAction<T> {
  iconClass: string;
  action: (item: T, event: React.MouseEvent) => void;
  tooltip: string;
  variant?: Variant;
}