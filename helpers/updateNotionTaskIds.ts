import { AxiosError } from 'axios';
import * as dotenv from 'dotenv';
import notion from '../lib/notion';
import { NotionData } from '../types/NotionData';
dotenv.config();

type IUpdateNotionTasks = {
  notionData: NotionData;
  prevNotionData: NotionData;
};

export const updateNotionTasks = async ({
  notionData,
  prevNotionData,
}: IUpdateNotionTasks) => {
  const tasksWithNoId = notionData?.results?.filter(
    (task) =>
      'Task name' in task?.properties &&
      //@ts-ignore
      task?.properties?.Id?.number === null &&
      //@ts-ignore
      task?.properties?.Project?.relation.length !== 0,
  );

  const tasksIds = notionData?.results
    ?.filter(
      //@ts-ignore
      (task) => task?.properties?.Id?.number,
    )
    //@ts-ignore
    .map((tk) => tk?.properties?.Id?.number);

  //@ts-ignore
  tasksIds.sort((a, b) => b - a);

  if (!tasksWithNoId) {
    console.log('NO TASKS WITHOUT IDS');
    return;
  }

  const prevTasks = prevNotionData?.results?.filter(
    (task) =>
      'Task name' in task?.properties &&
      //@ts-ignore
      task?.properties?.Id?.number === null,
  );

  if (JSON.stringify(tasksWithNoId) === JSON.stringify(prevTasks)) {
    console.log('SAME TASKS');
    return;
  }

  await Promise.all(
    tasksWithNoId.map(async (task, i) => {
      try {
        await notion.pages.update({
          page_id: task.id,
          properties: {
            Id: {
              //@ts-ignore
              number: tasksIds.length === 0 ? 100 + i : tasksIds[0] + i + 1,
            },
          },
        });
        console.log('SUCCESSFULLY UPDATED NOTION TASK ID');
      } catch (err) {
        const error = err as AxiosError<Error>;
        console.error('ERROR UPDATING TOGGL TASK', error.response?.data);
      }
    }),
  );
};
