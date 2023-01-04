export interface TogglClient {
  data: [Data];
}

export interface Data {
  id: number;
  wid: number;
  archived: boolean;
  name: string;
  at: string;
}
