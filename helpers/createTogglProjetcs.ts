import notion from '../lib/notion';
import { togglHelper } from './togglHelper';
//@ts-ignore
import randomHexColor from 'random-hex-color';
import { NotionData } from '../types/NotionData';
import { NotionDatabase } from '../types/NotionDatabase';
import { TogglClient } from '../types/TogglClient';
import { TogglProject } from '../types/TogglProject';

type ICreateTogglProjetcs = {
  notionData: NotionData;
  prevNotionData: NotionData;
};

export const createTogglProjetcs = async ({
  notionData,
  prevNotionData,
}: ICreateTogglProjetcs) => {
  const projects = notionData?.results?.filter(
    (project) =>
      'Project name' in project?.properties &&
      project?.properties?.Status?.status?.id === 'in-progress',
  );

  const prevProjects = prevNotionData?.results?.filter(
    (project) =>
      'Project name' in project?.properties &&
      project?.properties?.Status?.status?.id === 'in-progress',
  );

  if (JSON.stringify(projects) === JSON.stringify(prevProjects)) {
    console.log('SAME PROJECT');
    return;
  }

  const togglProjects = (await togglHelper({
    method: 'GET',
    endpoint: 'projects',
  })) as TogglProject;

  const differentProjects = projects?.filter((project: any) => {
    return !togglProjects?.data?.some(
      (togglProject: any) =>
        togglProject?.name ===
        project?.properties?.['Project name']?.title?.[0]?.plain_text,
    );
  });

  if (!differentProjects) {
    return;
  }

  console.log('differentProjects', differentProjects);

  await Promise.all(
    differentProjects.map(async (project: any) => {
      const databaseId = project?.parent?.database_id;

      const database = (await notion.databases.retrieve({
        database_id: databaseId,
      })) as NotionDatabase;

      const workspacePage = notionData?.results?.find(
        (data) => data.id === database?.parent?.page_id,
      );

      const clients = (await togglHelper({
        method: 'GET',
        endpoint: 'clients',
      })) as TogglClient;

      const client = clients?.data?.find(
        (obj) =>
          obj?.name ===
          workspacePage?.properties?.title?.title?.[0]?.plain_text,
      );

      await togglHelper({
        method: 'POST',
        endpoint: 'projects',
        data: {
          client_id: client?.id,
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
          cid: client?.id,
        },
      });
    }),
  );
};
