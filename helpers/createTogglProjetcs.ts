import { AxiosError } from 'axios';
import notion from '../lib/notion';
import { togglHelper } from './togglHelper';
//@ts-ignore
import randomHexColor from 'random-hex-color';
import { NotionData } from '../types/NotionData';
import { NotionDatabase } from '../types/NotionDatabase';
import { TogglClient, TogglClientData } from '../types/TogglClient';
import { TogglProject } from '../types/TogglProject';

type ICreateTogglProjetcs = {
  notionData: NotionData;
  prevNotionData: NotionData;
  togglClients: [TogglClientData] | undefined;
};

export const createTogglProjetcs = async ({
  notionData,
  prevNotionData,
  togglClients,
}: ICreateTogglProjetcs) => {
  console.log('PROJECTS');
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

  let togglProjects: TogglProject | undefined;

  try {
    togglProjects = (await togglHelper({
      method: 'GET',
      endpoint: 'projects',
    })) as TogglProject;
  } catch (err) {
    const error = err as AxiosError<Error>;
    console.error('ERROR GETTING TOGGL PROJECTS', error.response?.data);
  }

  const differentProjects = projects?.filter((project: any) => {
    return !togglProjects?.data?.some(
      (togglProject: any) =>
        togglProject?.name ===
        project?.properties?.['Project name']?.title?.[0]?.plain_text,
    );
  });

  if (differentProjects.length === 0) {
    return togglProjects?.data;
  }

  await Promise.all(
    differentProjects.map(async (project) => {
      const databaseId = project?.parent?.database_id;

      const database = (await notion.databases.retrieve({
        database_id: databaseId as string,
      })) as NotionDatabase;

      const workspacePage = notionData?.results?.find(
        //@ts-ignore
        (data) => data.id === database?.parent?.page_id,
      );

      let clients = togglClients;

      if (!clients) {
        const res = (await togglHelper({
          method: 'GET',
          endpoint: 'clients',
        })) as TogglClient;

        clients = res?.data;
      }

      const client = clients.find(
        (obj) =>
          obj.name === workspacePage?.properties?.title?.title?.[0]?.plain_text,
      );

      try {
        const res = await togglHelper({
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

        togglProjects?.data.push(res.data);

        console.log(
          `SUCCESFULLY CREATED TOGGL PROJECT ${project?.properties?.['Project name']?.title?.[0]?.plain_text}`,
        );
      } catch (err) {
        const error = err as AxiosError<Error>;
        console.error('ERROR CREATING TOGGL PROJECTS', error.response?.data);
      }
    }),
  );

  return togglProjects?.data;
};
