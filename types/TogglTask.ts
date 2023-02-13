export interface TogglTask {
  id: number;
  name: string;
  workspace_id: number;
  project_id: number;
  user_id: any;
  recurring: boolean;
  active: boolean;
  at: string;
  server_deleted_at: any;
  estimated_seconds: number;
  tracked_seconds: number;
}
