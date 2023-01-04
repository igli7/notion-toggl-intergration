import * as dotenv from 'dotenv';
dotenv.config();
import { SearchResponse } from '@notionhq/client/build/src/api-endpoints';
import { togglHelper } from './togglHelper';

type ICreateClients = {
  notionData: SearchResponse;
  prevNotionData: SearchResponse;
};

export const createTogglClientsFromPages = async ({
  notionData,
  prevNotionData,
}: ICreateClients) => {
  //@ts-ignore
  const workspacePages = notionData?.results?.filter(
    //@ts-ignore
    (page) => page?.parent?.type === 'workspace',
  );

  //@ts-ignore
  const prevWorkspacePages = prevNotionData?.results?.filter(
    //@ts-ignore
    (page) => page?.parent?.type === 'workspace',
  );

  if (JSON.stringify(workspacePages) === JSON.stringify(prevWorkspacePages)) {
    console.log('SAME WORKSPACE PAGES');
    return;
  }

  const togglClients = await togglHelper({
    method: 'GET',
    endpoint: 'clients',
  });

  const differentWorkspacePages = workspacePages?.filter((page: any) => {
    //@ts-ignore
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
