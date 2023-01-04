import * as dotenv from 'dotenv';
dotenv.config();
import { togglHelper } from './togglHelper';
import { NotionData } from '../types/NotionData';
import { TogglProject } from '../types/TogglProject';

type ICreateTogglTasks = {
  notionData: NotionData;
  prevNotionData: NotionData;
};

export const createTogglTasks = async ({
  notionData,
  prevNotionData,
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

  await Promise.all(
    tasks.map(async (task: any) => {
      const notionProject = notionData?.results?.find(
        (data) => data?.id === task?.properties?.Project?.relation?.[0]?.id,
      );

      const projects = (await togglHelper({
        method: 'GET',
        endpoint: 'projects',
      })) as TogglProject;

      const project = projects?.data?.find(
        (obj) =>
          obj?.name ===
          notionProject?.properties?.['Project name']?.title?.[0]?.plain_text,
      );

      await togglHelper({
        method: 'POST',
        endpoint: `projects/${project?.id}/tasks`,
        data: {
          active: true,
          name: task?.properties?.['Task name']?.title?.[0]?.plain_text,
          workspace_id: parseInt(process.env.TOGGL_WORKSPACE_ID as string),
          estimated_seconds:
            parseInt(task?.properties?.Estimates?.select?.name) * 60 * 60,
          project_id: project?.id,
        },
      });
    }),
  );
};
