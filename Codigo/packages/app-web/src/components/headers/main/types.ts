export type HeaderMenu = {
  type: 'LINK' | 'BUTTON';
  label: string;
  iconClass: string;
  withBackground: boolean;
};

export type HeaderMenuLink = HeaderMenu & {
  type: 'LINK';
  href: string;
};

export type HeaderMenuButton = HeaderMenu & {
  type: 'BUTTON';
  onClick: () => void;
};

export type MainHeaderType = {
  centerMenus: HeaderMenuLink[];
  leftMenus: HeaderMenuButton[];
};
