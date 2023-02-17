export interface TogglClient {
  data: [TogglClientData];
}

export interface TogglClientData {
  id: number;
  wid: number;
  archived: boolean;
  name: string;
  at: string;
}
