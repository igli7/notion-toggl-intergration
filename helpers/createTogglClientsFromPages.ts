import * as dotenv from 'dotenv';
dotenv.config();
import { togglHelper } from './togglHelper';
import { NotionData } from '../types/NotionData';
import { TogglClient } from '../types/TogglClient';

type ICreateClients = {
  notionData: NotionData;
  prevNotionData: NotionData;
};

export const createTogglClientsFromPages = async ({
  notionData,
  prevNotionData,
}: ICreateClients) => {
  const workspacePages = notionData?.results?.filter(
    (page) => page?.parent?.type === 'workspace',
  );

  const prevWorkspacePages = prevNotionData?.results?.filter(
    (page) => page?.parent?.type === 'workspace',
  );

  if (JSON.stringify(workspacePages) === JSON.stringify(prevWorkspacePages)) {
    console.log('SAME WORKSPACE PAGES');
    return;
  }

  const togglClients = (await togglHelper({
    method: 'GET',
    endpoint: 'clients',
  })) as TogglClient;

  const differentWorkspacePages = workspacePages?.filter((page: any) => {
    return !togglClients?.data?.some(
      (client: any) =>
        !client.name === page?.properties?.title?.title?.[0]?.plain_text,
    );
  });

  if (!differentWorkspacePages) {
    return;
  }

  await Promise.all(
    differentWorkspacePages.map(async (page: any) => {
      await togglHelper({
        method: 'POST',
        endpoint: 'clients',
        data: {
          name: page?.properties?.title?.title?.[0]?.plain_text,
          wid: parseInt(process.env.TOGGL_WORKSPACE_ID as string),
        },
      });
    }),
  );
};
