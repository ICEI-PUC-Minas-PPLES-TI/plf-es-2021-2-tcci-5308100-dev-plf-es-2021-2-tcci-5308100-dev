import { UserType } from '@sec/common';
import { FunctionComponent } from 'react';

type RouteSettingsBase = {
  show: boolean;
  path: string;

  allowedUsers: UserType[];
  component: FunctionComponent;
  tabHeader?: string | ((params: any) => string);
};

export type RouteSettingsShowed = {
  show: true;

  label: string;
  iconClass: string;
  hasNavMenu: boolean;
  bgClass?: string;
} & RouteSettingsBase;

export type RouteSettingsNotShowed = {
  show: false;
} & RouteSettingsBase;

export type RouteSettings = RouteSettingsShowed | RouteSettingsNotShowed;
