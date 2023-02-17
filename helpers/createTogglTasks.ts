import { AxiosError } from 'axios';
import * as dotenv from 'dotenv';
import { NotionData } from '../types/NotionData';
import { TogglProject, TogglProjectData } from '../types/TogglProject';
import { togglHelper } from './togglHelper';
dotenv.config();

type ICreateTogglTasks = {
  notionData: NotionData;
  prevNotionData: NotionData;
  togglProjects: [TogglProjectData] | undefined;
};

export const createTogglTasks = async ({
  notionData,
  prevNotionData,
  togglProjects,
}: ICreateTogglTasks) => {
  const tasks = notionData?.results?.filter(
    (task) =>
      'Task name' in task?.properties &&
      task?.properties?.Status?.status?.id === 'in-progress',
  );

  if (!tasks) {
    console.log('NO TASKS');
    return;
  }

  const prevTasks = prevNotionData?.results?.filter(
    (task) =>
      'Task name' in task?.properties &&
      task?.properties?.Status?.status?.id === 'in-progress',
  );

  if (JSON.stringify(tasks) === JSON.stringify(prevTasks)) {
    console.log('SAME TASKS');
    return;
  }

  const diffreentNotionTasks = tasks?.filter((task) => {
    return !prevTasks?.some((prevTask) => task?.id === prevTask?.id);
  });

  await Promise.all(
    diffreentNotionTasks.map(async (task: any) => {
      const notionProject = notionData?.results?.find(
        (data) => data?.id === task?.properties?.Project?.relation?.[0]?.id,
      );

      let projects = togglProjects;

      if (!togglProjects) {
        const res = (await togglHelper({
          method: 'GET',
          endpoint: 'projects',
        })) as TogglProject;
        projects = res?.data;
      }

      const togglProject = projects?.find(
        (obj) =>
          obj?.name ===
          notionProject?.properties?.['Project name']?.title?.[0]?.plain_text,
      );

      try {
        await togglHelper({
          method: 'POST',
          endpoint: `projects/${togglProject?.id}/tasks`,
          data: {
            active: true,
            name: `${task?.properties?.Id?.number} - ${task?.properties?.['Task name']?.title?.[0]?.plain_text}`,
            workspace_id: parseInt(process.env.TOGGL_WORKSPACE_ID as string),
            estimated_seconds: task?.properties?.Estimates?.select?.name
              ? parseInt(task?.properties?.Estimates?.select?.name) * 60 * 60
              : 0,
            project_id: togglProject?.id,
          },
        });
        console.log(
          `SUCCESSFULLY CREATED TASK ${task?.properties?.Id?.number} - ${task?.properties?.['Task name']?.title?.[0]?.plain_text}`,
        );
      } catch (err) {
        const error = err as AxiosError<Error>;
        console.error('ERROR CREATING TOGGL TASK', error.response?.data);
      }
    }),
  );
};
