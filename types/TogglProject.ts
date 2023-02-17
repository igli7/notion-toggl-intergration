export interface TogglProject {
  data: [TogglProjectData];
}

export interface TogglProjectData {
  id: number;
  workspace_id: number;
  client_id: number;
  name: string;
  is_private: boolean;
  active: boolean;
  at: string;
  created_at: string;
  server_deleted_at: any;
  color: string;
  billable: boolean;
  template: boolean;
  auto_estimates: boolean;
  estimated_hours?: number;
  rate: any;
  rate_last_updated: any;
  currency?: string;
  recurring: boolean;
  recurring_parameters: any;
  current_period: any;
  fixed_fee: any;
  actual_hours: number;
  wid: number;
  cid: number;
}
