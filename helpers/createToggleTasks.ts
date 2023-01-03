import { SearchResponse } from '@notionhq/client/build/src/api-endpoints';
import notion from '../lib/notion';
import { togglHelper } from './togglHelper';
//@ts-ignore
import randomHexColor from 'random-hex-color';

type ICreateTogglTasks = {
  notionData: SearchResponse;
  prevNotionData: SearchResponse;
};

export const createTogglTasks = async ({
  notionData,
  prevNotionData,
}: ICreateTogglTasks) => {
  const tasks = notionData?.results?.filter(
    (task) =>
      //@ts-ignore
      'Task name' in task?.properties &&
      //@ts-ignore
      task?.properties?.Status?.status?.id === 'in-progress',
  );

  if (!tasks) {
    console.log('NO TASKS');
    return;
  }

  const prevTasks = prevNotionData?.results?.filter(
    (task) =>
      //@ts-ignore
      'Task name' in task?.properties &&
      //@ts-ignore
      task?.properties?.Status?.status?.id === 'in-progress',
  );

  if (JSON.stringify(tasks) === JSON.stringify(prevTasks)) {
    console.log('SAME TASKS');
    return;
  }

  // const togglTasks = await togglHelper({
  //   method: 'GET',
  //   endpoint: 'projects',
  // });

  // const differentProjects = tasks?.filter((project: any) => {
  //   //@ts-ignore
  //   return !togglProjects?.data?.some(
  //     (togglProject: any) =>
  //       togglProject?.name ===
  //       project?.properties?.['Project name']?.title?.[0]?.plain_text,
  //   );
  // });

  // console.log('differentProjects', differentProjects);

  //@ts-ignore
  // console.log('togglProjects', togglProjects.data);
  // console.log(
  //   'PROJECT NAME',
  //   //@ts-ignore
  //   projects?.[0]?.properties?.['Project name']?.title?.[0]?.plain_text,
  // );

  // if (!differentProjects) {
  //   return;
  // }

  await Promise.all(
    tasks.map(async (project: any) => {
      const databaseId = project?.parent?.database_id;

      const database = await notion.databases.retrieve({
        database_id: databaseId,
      });

      console.log('databaseId', databaseId);

      //@ts-ignore
      console.log('database', database?.parent);

      const workspacePage = notionData?.results?.find(
        //@ts-ignore
        (data: any) => data.id === database?.parent?.page_id,
      );

      console.log('workspacePage', workspacePage);

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

      console.log('client', client);

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
