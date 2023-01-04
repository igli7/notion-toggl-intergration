import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { createTogglClientsFromPages } from './helpers/createTogglClientsFromPages';
import { createTogglProjetcs } from './helpers/createToggleProjects';
import notion from './lib/notion';
import { createTogglTasks } from './helpers/createToggleTasks';
import { NotionData } from './types/NotionData';

const app = express();

app.get('/', async (req, res) => {
  let prevNotionData: NotionData;

  setInterval(async () => {
    const notionData = (await notion.search({
      filter: {
        property: 'object',
        value: 'page',
      },
    })) as NotionData;

    if (JSON.stringify(notionData) !== JSON.stringify(prevNotionData)) {
      console.log('DIFFERENT NOTION DATA');
      await createTogglClientsFromPages({
        notionData,
        prevNotionData,
      });

      await createTogglProjetcs({
        notionData,
        prevNotionData,
      });

      await createTogglTasks({
        notionData,
        prevNotionData,
      });
    } else {
      console.log('SAME NOTION DATA');
    }

    prevNotionData = notionData;
  }, 15000);
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
