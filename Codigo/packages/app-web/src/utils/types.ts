export type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R;

export type ExcludeTypes<T, R extends string[]> = Pick<
  T,
  Exclude<keyof T, R[number]>
>;

export type Variant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';
