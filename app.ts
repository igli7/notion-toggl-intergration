import axios, { AxiosError } from 'axios';
import * as dotenv from 'dotenv';
import express from 'express';
import { addTagsToCurrentEntry } from './helpers/addTagsToCurrentEntry';
import { createTogglClientsFromPages } from './helpers/createTogglClientsFromPages';
import { createTogglProjetcs } from './helpers/createTogglProjetcs';
import { createTogglTasks } from './helpers/createTogglTasks';
import { updateNotionTasks } from './helpers/updateNotionTaskIds';
import notion from './lib/notion';
import { NotionData } from './types/NotionData';
import { TogglCurrentEntry } from './types/TogglCurrentEntry';
import togglAuthHeader from './utils/togglAuthHeader';
dotenv.config();

const app = express();

app.get('/', async (req, res) => {
  let prevNotionData: NotionData;
  let prevTogglCurrentEntry: TogglCurrentEntry;

  const main = async () => {
    try {
      const notionData = (await notion.search({
        filter: {
          property: 'object',
          value: 'page',
        },
      })) as NotionData;

      const togglCurrentEntry = await axios(
        `https://api.track.toggl.com/api/v9/me/time_entries/current`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: togglAuthHeader,
          },
        },
      );

      const togglCurrentEntryData = togglCurrentEntry.data as TogglCurrentEntry;

      if (
        JSON.stringify(togglCurrentEntryData) !==
        JSON.stringify(prevTogglCurrentEntry)
      ) {
        await addTagsToCurrentEntry({
          notionData,
          togglCurrentEntryData,
        });

        prevTogglCurrentEntry = togglCurrentEntryData;
      }

      // Console.log on the browser
      // res.send(
      //   `<script>
      //       console.log("All pages",${JSON.stringify(notionData, null, 2)})
      //   </script>`,
      // );

      if (JSON.stringify(notionData) !== JSON.stringify(prevNotionData)) {
        await updateNotionTasks({
          notionData,
          prevNotionData,
        });

        console.log('DIFFERENT NOTION DATA');
        const togglClients = await createTogglClientsFromPages({
          notionData,
          prevNotionData,
        });

        const togglProjects = await createTogglProjetcs({
          notionData,
          prevNotionData,
          togglClients,
        });

        await createTogglTasks({
          notionData,
          prevNotionData,
          togglProjects,
        });
      } else {
        console.log('SAME NOTION DATA');
      }

      prevNotionData = notionData;
    } catch (err) {
      const error = err as AxiosError<Error>;
      if (error.response?.data) {
        console.error('ERROR NOTION', error.response?.data);
      } else {
        console.error('ERROR NOTION', err);
      }
    }

    setTimeout(main, 10000);
  };

  main();
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
