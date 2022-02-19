import { ExplorerStatus, Explorer } from '../models/Explorer';

export type GetAllExplorersParams = {
  status?: ExplorerStatus[];
};

export type GetAllExplorersPayload = {
  explorers: Explorer[];
};

export type GetExplorerPayload = {
  explorer: Explorer;
};
