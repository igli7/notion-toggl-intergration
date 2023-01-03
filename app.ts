import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { SearchResponse } from '@notionhq/client/build/src/api-endpoints';
import { createTogglClientsFromPages } from './helpers/createTogglClientsFromPages';
import { createTogglProjetcs } from './helpers/createToggleProjects';
import notion from './lib/notion';

const app = express();

app.get('/', async (req, res) => {
  //   const res1 = await togglHelper({
  //     endpoint: 'clients',
  //     method: 'POST',
  //     data: {
  //       name: 'test client 1',
  //     },
  //   });

  //   console.log('res1', res1);
  let prevNotionData: SearchResponse;

  setInterval(async () => {
    // Calls Display Function
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
      //   await createTogglClientsFromPages({
      //     notionData,
      //     prevNotionData,
      //   });

      await createTogglProjetcs({
        notionData,
        prevNotionData,
      });
    } else {
      console.log('SAME NOTION DATA');
    }

    prevNotionData = notionData;
  }, 5000);

  //   const pagesFiltered = pages.results.filter(
  //     //@ts-ignore
  //     (page) => page?.properties?.Status?.status?.id === 'in-progress',
  //   );

  //   //@ts-ignore
  //   const tasks = pagesFiltered.filter((page) => 'Task name' in page?.properties);

  //   const projects = pagesFiltered.filter(
  //     //@ts-ignore
  //     (page) => 'Project name' in page?.properties,
  //   );

  //   const databases = await notion.search({
  //     filter: {
  //       property: 'object',
  //       value: 'database',
  //     },
  //   });

  //   res.send(
  //     `<script>
  //         console.log("All pages",${JSON.stringify(pages, null, 2)})
  //         console.log("workspacePages",${JSON.stringify(workspacePages, null, 2)})
  //         console.log("tasks",${JSON.stringify(tasks, null, 2)})
  //         console.log("projects",${JSON.stringify(projects, null, 2)})
  //         console.log("databases",${JSON.stringify(databases, null, 2)})
  //     </script>`,
  //   );
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
