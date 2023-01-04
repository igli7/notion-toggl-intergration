import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { SearchResponse } from '@notionhq/client/build/src/api-endpoints';
import { createTogglClientsFromPages } from './helpers/createTogglClientsFromPages';
import { createTogglProjetcs } from './helpers/createToggleProjects';
import notion from './lib/notion';
import { createTogglTasks } from './helpers/createToggleTasks';

const app = express();

app.get('/', async (req, res) => {
  let prevNotionData: SearchResponse;

  setInterval(async () => {
    const notionData = await notion.search({
      filter: {
        property: 'object',
        value: 'page',
      },
    });

    res.send(
      `<script>
          console.log("All pages",${JSON.stringify(notionData, null, 2)})
      </script>`,
    );

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
  }, 5000);
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
