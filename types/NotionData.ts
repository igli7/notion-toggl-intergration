export interface NotionData {
  object: string;
  results: Result[];
  next_cursor: any;
  has_more: boolean;
  type: string;
  page_or_database: PageOrDatabase;
}

export interface Result {
  object: string;
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: CreatedBy;
  last_edited_by: LastEditedBy;
  cover: any;
  icon?: Icon;
  parent: Parent;
  archived: boolean;
  properties: Properties;
  url: string;
}

export interface CreatedBy {
  object: string;
  id: string;
}

export interface LastEditedBy {
  object: string;
  id: string;
}

export interface Icon {
  type: string;
  emoji?: string;
  external?: External;
}

export interface External {
  url: string;
}

export interface Parent {
  type: string;
  database_id?: string;
  workspace?: boolean;
}

export interface Properties {
  'Date Completed'?: DateCompleted;
  Id?: Id;
  'Last edited time'?: LastEditedTime;
  'Long id'?: LongId;
  'Task name'?: TaskName;
  Assign?: Assign;
  Status?: Status;
  Due?: Due;
  Estimates?: Estimates;
  Tags?: Tags;
  Project?: Project;
  'Project name'?: ProjectName;
  People?: People2;
  Completion?: Completion;
  Dates?: Dates;
  Tasks?: Tasks;
  title?: Title3;
}

export interface DateCompleted {
  id: string;
  type: string;
  formula: Formula;
}

export interface Formula {
  type: string;
  date?: Date;
}

export interface Date {
  start: string;
  end: any;
  time_zone: any;
}

export interface Id {
  id: string;
  type: string;
  number?: number;
}

export interface LastEditedTime {
  id: string;
  type: string;
  last_edited_time: string;
}

export interface LongId {
  id: string;
  type: string;
  formula: Formula2;
}

export interface Formula2 {
  type: string;
  string: string;
}

export interface TaskName {
  id: string;
  type: string;
  title: Title[];
}

export interface Title {
  type: string;
  text: Text;
  annotations: Annotations;
  plain_text: string;
  href: any;
}

export interface Text {
  content: string;
  link: any;
}

export interface Annotations {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: string;
}

export interface Assign {
  id: string;
  type: string;
  people: People[];
}

export interface People {
  object: string;
  id: string;
  name: string;
  avatar_url: any;
  type: string;
  person: Person;
}

export interface Person {
  email: string;
}

export interface Status {
  id: string;
  type: string;
  status: Status2;
}

export interface Status2 {
  id: string;
  name: string;
  color: string;
}

export interface Due {
  id: string;
  type: string;
  date?: Date2;
}

export interface Date2 {
  start: string;
  end: any;
  time_zone: any;
}

export interface Estimates {
  id: string;
  type: string;
  select?: Select;
}

export interface Select {
  id: string;
  name: string;
  color: string;
}

export interface Tags {
  id: string;
  type: string;
  multi_select: MultiSelect[];
}

export interface MultiSelect {
  id: string;
  name: string;
  color: string;
}

export interface Project {
  id: string;
  type: string;
  relation: Relation[];
  has_more: boolean;
}

export interface Relation {
  id: string;
}

export interface ProjectName {
  id: string;
  type: string;
  title: Title2[];
}

export interface Title2 {
  type: string;
  text: Text2;
  annotations: Annotations2;
  plain_text: string;
  href: any;
}

export interface Text2 {
  content: string;
  link: any;
}

export interface Annotations2 {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: string;
}

export interface People2 {
  id: string;
  type: string;
  people: any[];
}

export interface Completion {
  id: string;
  type: string;
  rollup: Rollup;
}

export interface Rollup {
  type: string;
  number?: number;
  function: string;
}

export interface Dates {
  id: string;
  type: string;
  date?: Date3;
}

export interface Date3 {
  start: string;
  end?: string;
  time_zone: any;
}

export interface Tasks {
  id: string;
  type: string;
  relation: Relation2[];
  has_more: boolean;
}

export interface Relation2 {
  id: string;
}

export interface Title3 {
  id: string;
  type: string;
  title: Title4[];
}

export interface Title4 {
  type: string;
  text: Text3;
  annotations: Annotations3;
  plain_text: string;
  href: any;
}

export interface Text3 {
  content: string;
  link: any;
}

export interface Annotations3 {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: string;
}

export interface PageOrDatabase {}
