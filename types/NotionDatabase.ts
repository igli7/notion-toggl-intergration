import { Result, Title } from './NotionData';

export interface NotionDatabase extends Result {
  title: Title[];
  description: any[];
  is_inline: boolean;
}
