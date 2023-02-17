import { AxiosError } from 'axios';
import * as dotenv from 'dotenv';
import { NotionData } from '../types/NotionData';
import { TogglClient } from '../types/TogglClient';
import { togglHelper } from './togglHelper';
dotenv.config();

type ICreateClients = {
  notionData: NotionData;
  prevNotionData: NotionData;
};

export const createTogglClientsFromPages = async ({
  notionData,
  prevNotionData,
}: ICreateClients) => {
  console.log('CLIENTS');
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

  let togglClients: TogglClient | undefined;

  try {
    togglClients = (await togglHelper({
      method: 'GET',
      endpoint: 'clients',
    })) as TogglClient;
  } catch (err) {
    const error = err as AxiosError<Error>;
    console.error('ERROR GETTING TOGGL CLIENTS', error.response?.data);
  }

  const differentWorkspacePages = workspacePages?.filter((page) => {
    return !togglClients?.data?.some(
      (client) =>
        client?.name === page?.properties?.title?.title?.[0]?.plain_text,
    );
  });

  if (differentWorkspacePages.length === 0) {
    return togglClients?.data;
  }

  await Promise.all(
    differentWorkspacePages.map(async (page: any) => {
      try {
        const res = await togglHelper({
          method: 'POST',
          endpoint: 'clients',
          data: {
            name: page?.properties?.title?.title?.[0]?.plain_text,
            wid: parseInt(process.env.TOGGL_WORKSPACE_ID as string),
          },
        });

        togglClients?.data.push(res.data);
      } catch (err) {
        const error = err as AxiosError<Error>;
        console.error('ERROR CREATING TOGGL CLIENT', error.response?.data);
      }
    }),
  );

  return togglClients?.data;
};
