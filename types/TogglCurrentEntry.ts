export interface TogglCurrentEntry {
  id: number;
  workspace_id: number;
  project_id: number;
  task_id: number;
  billable: boolean;
  start: Date;
  stop: null;
  duration: number;
  description: string;
  tags: any[];
  tag_ids: any[];
  duronly: boolean;
  at: Date;
  server_deleted_at: null;
  user_id: number;
  uid: number;
  wid: number;
  pid: number;
  tid: number;
}
