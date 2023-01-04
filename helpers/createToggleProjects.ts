import { SearchResponse } from '@notionhq/client/build/src/api-endpoints';
import notion from '../lib/notion';
import { togglHelper } from './togglHelper';
//@ts-ignore
import randomHexColor from 'random-hex-color';

type ICreateTogglProjetcs = {
  notionData: SearchResponse;
  prevNotionData: SearchResponse;
};

export const createTogglProjetcs = async ({
  notionData,
  prevNotionData,
}: ICreateTogglProjetcs) => {
  const projects = notionData?.results?.filter(
    (project) =>
      //@ts-ignore
      'Project name' in project?.properties &&
      //@ts-ignore
      project?.properties?.Status?.status?.id === 'in-progress',
  );

  const prevProjects = prevNotionData?.results?.filter(
    (project) =>
      //@ts-ignore
      'Project name' in project?.properties &&
      //@ts-ignore
      project?.properties?.Status?.status?.id === 'in-progress',
  );

  if (JSON.stringify(projects) === JSON.stringify(prevProjects)) {
    console.log('SAME PROJECT');
    return;
  }

  const togglProjects = await togglHelper({
    method: 'GET',
    endpoint: 'projects',
  });

  const differentProjects = projects?.filter((project: any) => {
    //@ts-ignore
    return !togglProjects?.data?.some(
      (togglProject: any) =>
        togglProject?.name ===
        project?.properties?.['Project name']?.title?.[0]?.plain_text,
    );
  });

  if (!differentProjects) {
    return;
  }

  await Promise.all(
    differentProjects.map(async (project: any) => {
      const databaseId = project?.parent?.database_id;

      const database = await notion.databases.retrieve({
        database_id: databaseId,
      });

      const workspacePage = notionData?.results?.find(
        //@ts-ignore
        (data: any) => data.id === database?.parent?.page_id,
      );

      const clients = await togglHelper({
        method: 'GET',
        endpoint: 'clients',
      });

      //@ts-ignore
      const client = clients?.data?.find(
        (obj: any) =>
          obj?.name ===
          //@ts-ignore
          workspacePage?.properties?.title?.title?.[0]?.plain_text,
      );

      await togglHelper({
        method: 'POST',
        endpoint: 'projects',
        data: {
          client_id: client.id,
          name: project?.properties?.['Project name']?.title?.[0]?.plain_text,
          is_private: true,
          active: true,
          color: randomHexColor(),
          billable: true,
          template: false,
          auto_estimates: true,
          //   estimated_hours: parseInt(
          //     project?.properties?.Estimates?.select?.name,
          //   ),
          rate: null,
          cid: client.id,
        },
      });
    }),
  );
};
