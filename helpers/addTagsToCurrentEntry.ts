import axios, { AxiosError, AxiosResponse } from 'axios';
import * as dotenv from 'dotenv';
import { NotionData } from '../types/NotionData';
import { TogglCurrentEntry } from '../types/TogglCurrentEntry';
import { TogglTask } from '../types/TogglTask';
import togglAuthHeader from '../utils/togglAuthHeader';
import { togglHelper } from './togglHelper';
dotenv.config();

type IAddTagsToCurrentEntry = {
  notionData: NotionData;
  togglCurrentEntryData: TogglCurrentEntry;
};

export const addTagsToCurrentEntry = async ({
  notionData,
  togglCurrentEntryData,
}: IAddTagsToCurrentEntry) => {
  if (togglCurrentEntryData?.tags?.length > 0) {
    console.log('Tags already exist');
    return;
  }
  let togglTask: AxiosResponse<any, any> | undefined;

  try {
    togglTask = (await togglHelper({
      method: 'GET',
      endpoint: `projects/${togglCurrentEntryData?.project_id}/tasks/${togglCurrentEntryData?.task_id}`,
    })) as AxiosResponse<any, any>;
  } catch (err) {
    const error = err as AxiosError<Error>;
    console.error('ERROR TRYING TO GET TOGGL TASK', error.response?.data);
  }

  const togglTaskData = togglTask?.data as TogglTask;

  const notionTask = notionData.results.find(
    (notion) =>
      notion?.properties?.['Task name']?.title?.[0]?.plain_text ===
      togglTaskData?.name.slice(6),
  );

  if (!notionTask?.properties?.Tags?.multi_select[0]?.name) {
    return;
  }

  try {
    await axios.put(
      `https://api.track.toggl.com/api/v9/workspaces/${process.env.TOGGL_WORKSPACE_ID}/time_entries/${togglCurrentEntryData.id}`,
      {
        tags: [`${notionTask?.properties?.Tags?.multi_select[0]?.name}`],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: togglAuthHeader,
        },
      },
    );
  } catch (err) {
    const error = err as AxiosError<Error>;
    console.error(
      'ERROR TRYING TO GET ADD TAGS TO ENTRY TASK',
      error.response?.data,
    );
  }
};
