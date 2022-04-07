import { ExplorerStatus, Explorer } from '../models/Explorer';

export type AccessLast30DaysRaw = { dayofmonth: string; qtdaccess: string };
export type AccessLast30Days = { dayOfMonth: string; qtdAccess: number };

export type GetDashboardDataParams = {};

export type GetDashboardDataPayload = {
  accessLast30Days: AccessLast30Days[];
  totalUsers: number;
  totalOpenChallenges: number;
  totalChallenges: number;
  postsWithHashtags: number;
  postsWithHashtagsLast24h: number;
};
