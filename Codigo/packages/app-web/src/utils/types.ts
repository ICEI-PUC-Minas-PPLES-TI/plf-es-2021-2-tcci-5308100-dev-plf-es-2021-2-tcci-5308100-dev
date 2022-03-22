export type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

export type GenericFileType = Record<string, unknown> & { id: number | string; name: string; path: string };
